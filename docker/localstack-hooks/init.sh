#!/bin/bash

awslocal sqs create-queue \
    --region us-east-1 \
    --queue-name "local-sqs-queue" \