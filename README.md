# aws-s3-logs-splunk
AWS Lambda Function that send S3 logs to Splunk


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