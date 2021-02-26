const {flat} = require("../../sharedUtils/arrayUtils");
const {chunk} = require("../../sharedUtils/arrayUtils");
const { StreetUtils } = require("./utils");
const { loadData } = require("../../sharedUtils/cheerioUtils");
const { AWSQueue, parseRecord } = require("../../sharedUtils/awsUtils");


module.exports.saveStreets = async (event, context, callback) => {
    const letters = parseRecord(event);

    const streetDataPromises = letters.map(async letter => {
        const letterData = await loadData(letter.letterLink);

        // If a page fails to load, it will return null.
        return letterData ? new StreetUtils(letter, letterData).getStreetLinks() : null;
    });

    const streetData = await Promise.all(streetDataPromises);

    const queue = new AWSQueue("HouseQueue");

    const streetChunks = chunk(flat(streetData).filter(Boolean), 30);

    await Promise.all(streetChunks.map(async streetArray => {
        await queue.invoke(streetArray);
    }));


    context.done(null, '');

}

