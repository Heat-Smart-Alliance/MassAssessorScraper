const mongoose = require('mongoose');
const { Schema } = mongoose;

const townSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastUpdated: Date
}, { timestamps: true});

module.exports = Town = mongoose.model('Town', townSchema);