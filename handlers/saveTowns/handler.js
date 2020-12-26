'use strict';

const {loadData} = require("../../sharedUtils/cheerioUtils");
const { TownUtils } = require('./utils');

module.exports.saveTowns = async event => {
    const base = "https://www.vgsi.com/massachusetts-online-database/";

    const utils = new TownUtils(await loadData(base));

    const townLinks = utils.getTownLinks();

    await utils.saveTownInformation();

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "test",
                input: event,
            },
            null,
            2
        ),
    };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
