'use strict';

const { loadData } = require("../../sharedUtils/cheerioUtils");
const { TownUtils } = require('./utils');

const AWS = require('aws-sdk');
const sqs = new AWS.SQS({
    region: 'us-east-1'
});

const AWS_ACCOUNT = process.env.ACCOUNT_ID;
const QUEUE_URL = 'http://localhost:9324/queue/TownQueue';


module.exports.saveTowns = async (event, context, callback) => {
    const baseLink = "https://www.vgsi.com/massachusetts-online-database/";
    const pageData = await loadData(baseLink);

    const utils = new TownUtils(pageData);

    let townsToUpdate = await utils.getTownsToUpdate();

    const townLinks = utils.getTownLinksToScrape(townsToUpdate);

    const params = {
        MessageBody: JSON.stringify(townLinks),
        QueueUrl: QUEUE_URL
    }

    sqs.sendMessage(params, function(err, data) {
        if(err){
            console.log(`There was an error sending the message ${err}`);
            const response = {
                statusCode: 500,
                body: JSON.stringify({
                    message: err
                })
            };

            callback(null, response);
        } else {

            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: data.MessageId
                })
            };

            callback(null, response);
        }
    });
};
