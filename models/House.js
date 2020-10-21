const mongoose = require('mongoose');
const { Schema } = mongoose;

const deleteEmpty = (str) => {
    if(str.length == 0) {
        return null;
    }
    return str;
}

const houseSchema = new Schema({
    heatType: {
        type: String,
        required: false,
        set: deleteEmpty
    },
    heatFuel: {
        type: String,
        required: false,
        set: deleteEmpty
    },
    address: {
        type: String,
        required: false,
        set: deleteEmpty
    },
    stories: {
        type: String,
        required: false,
        set: deleteEmpty
    },
    grade: {
        type: String,
        required: false,
        set: deleteEmpty
    },
    model: {
        type: String,
        required: false,
        set: deleteEmpty
    },
    owner: {
        type: String,
        required: false,
        set: deleteEmpty
    },
    assessment: {
        type: String,
        required: false,
        set: deleteEmpty
    },
    salePrice: {
        type: String,
        required: false,
        set: deleteEmpty
    },
    yearBuilt: {
        type: String,
        required: false,
        set: deleteEmpty
    },
    occupancy: {
        type: String,
        required: false,
        set: deleteEmpty
    },
    totalRooms: {
        type: String,
        required: false,
        set: deleteEmpty
    }
});

module.exports = House = mongoose.model('House', houseSchema);