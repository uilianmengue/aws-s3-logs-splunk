### AWS Lambda Function that send S3 logs to Splunk

### How it works

The lambda function receive the bucket event 

#### Enviroments

SPLUNK_HEC_URL="Your splunk HEC"\
SPLUNK_HEC_TOKEN="Your splunk Token"

#### Bucket Policy
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

For do teh tests you need to change event.json with a valid event data.

```
$ export SPLUNK_HEC_URL=
$ export SPLUNK_HEC_TOKEN=
$ npm install 
$ npm run test

```