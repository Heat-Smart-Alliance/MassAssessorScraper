'use strict';

const { loadData } = require("../../sharedUtils/cheerioUtils");
const { TownUtils } = require('./utils');

const AWS = require('aws-sdk');
const sqs = new AWS.SQS({
    region: 'us-east-1'
});

const QUEUE_URL = `${process.env.QUEUE_URL}TownQueue`;

/**
 * saveTowns is a lambda that saves information from https://www.vgsi.com/massachusetts-online-database/.
 * It takes the town names and the dates they were last updated, and saves it to a database.
 * After saving those town names, it then gets the links to the pages of the respective towns and feeds that into a
 * queue.
 *
 * @param event - the AWS event
 * @param context - the context of the event
 * @param callback - a callback function which signals the response of the function
 */
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
                    message: townLinks
                })
            };

            callback(null, response);
        }
    });
};
