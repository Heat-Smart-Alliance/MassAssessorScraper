const moment = require('moment');

function convertTownDate(date) {
    switch(date) {
        case "":
            return moment.now().valueOf();
        case "Daily":
            return moment().startOf("day").valueOf();
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