'use strict';

const { AWSQueue } = require("../../sharedUtils/awsUtils");
const { loadData } = require("../../sharedUtils/cheerioUtils");
const { TownUtils } = require('./utils');

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

    const townUtil = new TownUtils(pageData);

    const townsToUpdate = await townUtil.getTownsToUpdate();

    console.log("Towns to update:", townsToUpdate);
    const townLinks = townUtil.getTownLinksToScrape(townsToUpdate);

    const queue = new AWSQueue("TownQueue");

    const response = await queue.invoke(townLinks);

    return response;
};
