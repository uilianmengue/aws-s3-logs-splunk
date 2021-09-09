### AWS Lambda Function to send your S3 logs to Splunk

### How it works

The lambda function receive the from the bucket the event of the file created.
This event contain the bucket name and file path, the function get this file, parser and send your content for Splunk.

### Deploy

#### Trigger

You need to add a new trigger in lambda function, you have to choose a S3 Bucket, choose your bucket name and choose "All object create events".

#### Environments

You need to set the Environments below.

SPLUNK_HEC_URL="Your splunk HEC"\
SPLUNK_HEC_TOKEN="Your splunk Token"

#### Bucket Policy

Set the bucket policy below for permit lambda function to access your files in S3 Bucket.

```
{
    "Sid": "PolicyForLambda",
    "Effect": "Allow",
    "Principal": {
        "AWS": "arn:aws:iam::xxxxxxxxxxxx:role/service-role/your-lambda-role"
    },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-bucket/*"
}
```

#### Permission in Lambda Role

Also, set in your lambda role the permission for access your S3 bucket.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket"
        }
    ]
}
```

### Locally Tests

For do the tests you need to change event.json with a valid event data.
For locally tests you need have access to S3 bucket with aws-sdk, you can use ``` aws configur ```

```
$ export SPLUNK_HEC_URL=
$ export SPLUNK_HEC_TOKEN=
$ npm install 
$ npm run test

```