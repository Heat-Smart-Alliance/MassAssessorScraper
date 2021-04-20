const mongoose = require('mongoose');

let cachedDb = null;

/**
 * connectToDatabase connects to the mongo database and returns the mongoose connection
 * @returns the connection to the mongo database
 */
function connectToDB() {
    if(cachedDb) {
        const db = Promise.resolve(cachedDb);
        return db;
    }
    return mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then((db) => {
        cachedDb = db;
        return db.connection;
    }).catch(e => console.log(e));
}

module.exports = {
    connectToDB
}