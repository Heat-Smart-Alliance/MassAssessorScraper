const { AWSQueue } = require("../../sharedUtils/awsUtils");
const { ScraperUtils } = require("./utils");
const { loadData } = require("../../sharedUtils/cheerioUtils");
const { parseRecord } = require("../../sharedUtils/awsUtils");

module.exports.scrapeHouses = async (event, context, callback) => {
    const houses = parseRecord(event);

    const scrapeDataPromises = houses.map(async address => {
        const housePage = await loadData(address.houseLink);

        return housePage ? new ScraperUtils(address, housePage).getPageContent() : null;
    });

    const houseData = await Promise.all(scrapeDataPromises);

    const queue = new AWSQueue("DatabaseQueue");

    await queue.invoke(houseData);

    context.done(null, '')

}