const {chunk} = require("../../sharedUtils/arrayUtils");
const {flat} = require("../../sharedUtils/arrayUtils");
const { AWSQueue } = require("../../sharedUtils/awsUtils");
const { HouseUtils } = require("./utils");
const { loadData } = require("../../sharedUtils/cheerioUtils");
const { parseRecord } = require("../../sharedUtils/awsUtils");

module.exports.saveHouses = async (event, context, callback) => {
    const streets = parseRecord(event);

    const houseDataPromises = streets.map(async street => {
       const streetData = await loadData(street.streetLink);

       return streetData ? new HouseUtils(street, streetData).getHouseLinks() : null;
    });


    const houseData = await Promise.all(houseDataPromises);

    const houseChunks = chunk(flat(houseData), 100);

    const queue = new AWSQueue("ScrapeQueue");

    await Promise.all(houseChunks.map(async houseArray => await queue.invoke(houseArray)));

    context.done(null, '');
};
