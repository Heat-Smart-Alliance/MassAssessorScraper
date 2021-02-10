const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

class AWSQueue {
    constructor(queueName) {
        this.sqs = new AWS.SQS({
            apiVersion: '2012-11-05',
            endpoint: 'http://sqs:9324'
        });
        this.queueName = queueName;
    }

    async invoke(data) {
        const QUEUE_URL = `${process.env.QUEUE_URL}${this.queueName}`;

        const params = {
            MessageBody: JSON.stringify(data),
            QueueUrl: QUEUE_URL
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
    }
}

function parseRecord(event){
    return JSON.parse(event.Records[0].body);
}

module.exports = {
    AWSQueue,
    parseRecord
}