const {flat} = require("../../sharedUtils/arrayUtils");
const {chunk} = require("../../sharedUtils/arrayUtils");
const { StreetUtils } = require("./utils");
const { loadData } = require("../../sharedUtils/cheerioUtils");
const { AWSQueue, parseRecord } = require("../../sharedUtils/awsUtils");


module.exports.saveStreets = async (event, context, callback) => {
    const letters = parseRecord(event);

    console.log("Letters:", letters);
    const streetDataPromises = letters.map(async letter => {
        const letterData = await loadData(letter.letterLink);

        // If a page fails to load, it will return null.
        return letterData ? new StreetUtils(letter, letterData).getStreetLinks() : null;
    });

    const streetData = await Promise.all(streetDataPromises);


    const queue = new AWSQueue("HouseQueue");


    const streetChunks = chunk(flat(streetData).filter(Boolean), 10);

    console.log("Street Number:", streetChunks.length * 10);
    const invokeHousePromises = streetChunks.map(async streetArray => {
        return await queue.invoke(streetArray);
    });

    try {
        const houseMessages = await Promise.all(invokeHousePromises);
    } catch(e) {
        console.log(`Error: ${e}`);
    }
    context.done(null, '');

}

