const moment = require('moment');

function convertTownDate(date) {
    console.log(date);
    switch(date) {
        case "":
            return moment.now();
        case "Daily":
            return moment.now();
        case "Monthly":
            return moment().startOf("month").valueOf();
        default:
            const allowedDateFormats = ["MM/DD/YYYY", "MM/DD/YY"];
            return moment(date, allowedDateFormats).valueOf();
    }
}

module.exports = {
    convertTownDate
}