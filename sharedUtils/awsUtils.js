const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

class AWSQueue {
    constructor(queueName) {
        this.sqs = new AWS.SQS({
            apiVersion: '2012-11-05',
            endpoint: 'http://sqs:9324'
        });
        this.queueName = queueName;
        this.queueURL = `${process.env.QUEUE_URL}${this.queueName}`;
    }

    getQueueAttributes(){
        const params = {
            QueueUrl: this.queueURL,
            AttributeNames : ['ApproximateNumberOfMessages'],
        };
        this.sqs.getQueueAttributes(params, function(err, data){
            if (err) {
                console.log("Error", err);
            } else {
                console.log(data);
            }
        });
    }

    mapDataToBatch(data) {
        const params = {
            Entries: data.map(d => {
                MessageBody: JSON.stringify(d)
            }),
            QueueUrl: this.queueURL
        };

        return params;
    }

    async invokeBatch(data) {

        let sqsResponse;
        try {
            sqsResponse = await this.sqs.sendMessageBatch().promise()
        } catch(e) {
            return {
                statusCode: 500,
                body: `Error batch invoking ${e}`
            }
        }
    }
    async invoke(data) {

        const params = {
            MessageBody: JSON.stringify(data),
            QueueUrl: this.queueURL
        }

        let sqsResponse;
        try {
            sqsResponse = await this.sqs.sendMessage(params).promise();
        } catch(e) {
            return {
                statusCode: 500,
                body: `Error invoking: ${e}`
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(sqsResponse)
        }

        return {
            statusCode: 200,
            body: JSON.stringify(sqsResponse)
        }
    }
}

function parseRecord(event){
    return JSON.parse(event.Records[0].body);
}

module.exports = {
    AWSQueue,
    parseRecord
}