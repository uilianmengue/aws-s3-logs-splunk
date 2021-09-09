/**
 * Splunk logging for AWS Lambda by Uilian Mengue
 *
 * This function logs to a Splunk host using Splunk's HTTP event collector API.
 *
 * Define the following Environment Variables in the console below to configure
 * this function to log to your Splunk host:
 *
 * 1. SPLUNK_HEC_URL: URL address for your Splunk HTTP event collector endpoint.
 * Default port for event collector is 8088. Example: https://host.com:8088/services/collector
 *
 * 2. SPLUNK_HEC_TOKEN: Token for your Splunk HTTP event collector.
 * To create a new token for this Lambda function, refer to Splunk Docs:
 * http://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector#Create_an_Event_Collector_token
 */
 const loggerConfig = {
    url: process.env.SPLUNK_HEC_URL,
    token: process.env.SPLUNK_HEC_TOKEN,
};

const SplunkLogger = require('./lib/splunklogger');

const logger = new SplunkLogger(loggerConfig);
const aws = require('aws-sdk');
const zlib = require('zlib');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    s3.getObject(params, (error, data) => {
        if (error) {
            console.log(error);
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            console.log(message);
            callback(message);
        } else {
            console.log(`Retrieved access log: LastModified="${data.LastModified}" ContentLength=${data.ContentLength}`);
            const payload = data.Body;

            zlib.gunzip(payload, (error, result) => { // eslint-disable-line no-shadow
                if (error) {
                    console.log(error);
                    callback(error);
                } else {
                    const parsed = result.toString('ascii');
                    const logEvents = parsed.split('\n');
                    let count = 0;
                    let json_data

                    if (logEvents) {
                        json_data = JSON.parse(logEvents);
                        json_data.Records.forEach((logEntry) => {
                            if (logEntry) {
                                logger.log(JSON.stringify(logEntry), context);
                                count += 1;
                            }
                        });
                        console.log(`Processed ${count} log entries`);
                    }
                }
            });
        }
    });
    logger.flushAsync((error, response) => {
        if (error) {
            callback(error);
        } else {
            console.log(`Response from Splunk:\n${response}`);
            callback(null, event.key1); // Echo back the first key value
        }
    });
};