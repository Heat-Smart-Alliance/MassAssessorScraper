const { singleSpaces } = require("../../sharedUtils/stringUtils");
const { CheerioUtils } = require("../../sharedUtils/cheerioUtils");

class ScraperUtils extends CheerioUtils {
    constructor(link, ...pageData) {
        super(...pageData);
        this.link = link;
    }

    getPageContent() {
        const $ = this.$;
        const { townID } = this.link;
        const data = {
            townID,
            address: singleSpaces(`${$("#MainContent_lblLocation").text()} ${$("#lblTownName").text()}`)
        }
        return data;
    }
}

module.exports = {
    ScraperUtils
}