const mongoose = require('mongoose');

async function connectToDB() {
    console.log("DATABASE URL IS: ", process.env.DATABASE_URL);
    await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connecting! Starting to scrape houses now!");
    }).catch(e => console.log(e));
    const db = mongoose.connection;
    return db;
}

module.exports = {
    connectToDB
}