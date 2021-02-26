'use strict';

const { AWSQueue, parseRecord } = require("../../sharedUtils/awsUtils");
const { flat, chunk } = require("../../sharedUtils/arrayUtils");
const { loadData } = require("../../sharedUtils/cheerioUtils");
const { LetterUtils } = require('./utils');

module.exports.saveLetters = async (event, context, callback) => {
    const towns = parseRecord(event);

    const letterDataPromises = towns.map(async town => {
        const townData = await loadData(town.townLink);

        // If a page fails to load, it will return null.
        return townData ? new LetterUtils(town, townData).getLetterLinks() : null;
    });


    const letterData = await Promise.all(letterDataPromises)

    const queue = new AWSQueue("LetterQueue");

    const letterChunks = chunk(flat(letterData).filter(Boolean), 20);

    await Promise.all(letterChunks.map(async letterArray => {
        return await queue.invoke(letterArray);
    }));

    context.done(null, '');
};