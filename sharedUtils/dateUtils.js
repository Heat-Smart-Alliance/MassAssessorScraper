const moment = require('moment');

/**
 * convertTownDate takes a date from https://www.vgsi.com/massachusetts-online-database/, and converts it to a date
 * object to ensure that it is saved properly in the database.
 * @param date - a string that represents a date. The string may be empty, a fixed enum such as Daily or Monthly or be in the format of "MM/DD/YYYY" or "MM/DD/YY"
 * @returns a moment date, which represents the seconds since January 1st, 1970
 */
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