const mongoose = require('mongoose');

/**
 * connectToDatabase connects to the mongo database and returns the mongoose connection
 * @returns the connection to the mongo database
 */
async function connectToDB() {
    await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected to database");
    }).catch(e => console.log(e));
    const db = mongoose.connection;
    return db;
}

module.exports = {
    connectToDB
}