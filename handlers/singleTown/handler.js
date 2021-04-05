'use strict';

const {SingleTownUtils} = require("./utils");
const { AWSQueue } = require("../../sharedUtils/awsUtils");
const { loadData } = require("../../sharedUtils/cheerioUtils");

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
module.exports.singleTown = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const baseLink = "https://www.vgsi.com/massachusetts-online-database/";
    const pageData = await loadData(baseLink);

    const townUtil = new SingleTownUtils(pageData);
    const townsToUpdate = await townUtil.getTownData(event.queryStringParameters.town);
    console.log(townsToUpdate)
    const queue = new AWSQueue("TownQueue");
    const response = await queue.invoke(townsToUpdate);
    callback(null, {status: 200})
};