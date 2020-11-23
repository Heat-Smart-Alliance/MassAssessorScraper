const mongoose = require('mongoose');
const { Schema } = mongoose;

const civicSchema = new Schema({
    officials: [{
        name: String,
        address: {
            line1: String,
            city: String,
            state: String,
            zip: String
        },
        party: String,
        phones: [String],
        emails: [String]
    }]
});

module.exports = civicSchema;