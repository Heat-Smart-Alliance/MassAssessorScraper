const mongoose = require('mongoose');
const { Schema } = mongoose;
const CivicSchema = require("./CivicData");

const deleteEmpty = (str) => {
    if(str.length == 0) {
        return null;
    }
    return str;
}

const houseSchema = new Schema({
    address: {
        type: String,
        required: true
    },
    townID: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number]
        }
    },
    owner: {
        type: String,
    },
    assessment: {
        type: String,
    },
    salePrice: {
        type: String,
    },
    saleDate: {
        type: String,
    },
    yearBuilt: {
        type: String,
    },
    pid: {
        type: String
    }
    // civicData: [CivicSchema],
    // heatType: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },
    // heatFuel: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },
    // address: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },
    // stories: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },
    // grade: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },
    // model: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },
    // owner: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },

    // salePrice: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },
    // yearBuilt: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },
    // occupancy: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },
    // squareFeet: {
    //     type: Number,
    //     required: false,
    //     set: deleteEmpty
    // },
    // totalRooms: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },
    // townName: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // },
    // appraisal: {
    //     type: String,
    //     required: false,
    //     set: deleteEmpty
    // }
});

module.exports = House = mongoose.models.House || mongoose.model('House', houseSchema);