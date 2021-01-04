'use strict';

const {loadData} = require("../../sharedUtils/cheerioUtils");
const { TownUtils } = require('./utils');

module.exports.saveTowns = async event => {
    const baseLink = "https://www.vgsi.com/massachusetts-online-database/";

    const pageData = await loadData(baseLink);

    const utils = new TownUtils(pageData);

    let townsToUpdate = await utils.getTownsToUpdate();

    const townLinks = utils.getTownLinksToScrape(townsToUpdate);

    return {
        message: townLinks,
        event
    };
    // return {
    //     statusCode: 200,
    //     body: JSON.stringify(
    //         {
    //             message: townLinks,
    //             input: event,
    //         },
    //         null,
    //         2
    //     ),
    // };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
