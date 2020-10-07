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
    }
});

module.exports = House = mongoose.model('House', houseSchema);