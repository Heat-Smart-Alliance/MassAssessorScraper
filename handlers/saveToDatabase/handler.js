const { connectToDB } = require("../../sharedUtils/databaseUtils");
const { parseRecord } = require("../../sharedUtils/awsUtils");
const House = require("../../models/House");
module.exports.saveToDatabase = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const recordsToAdd = parseRecord(event);
    console.log(recordsToAdd)
    await connectToDB()
        .then(() => House.insertMany(recordsToAdd))
        .catch(e => console.log(`Error adding houses ${e}`));
    context.done(null, '');
};