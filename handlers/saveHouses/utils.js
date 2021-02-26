const {CheerioUtils} = require("../../sharedUtils/cheerioUtils");

class HouseUtils extends CheerioUtils {
    constructor(link, ...pageData) {
        super(...pageData);
        this.link = link;
    }

    getHouseLinks() {
        const { baseLink, townID } = this.link;
        const $ = this.$;

        const links = $('#list > li > a').map((i, a) => {
            return {
                houseLink: `${baseLink}/${$(a).attr('href')}`,
                townID
            }
        }).get();

        return links;
    }
}

module.exports = {
    HouseUtils
}