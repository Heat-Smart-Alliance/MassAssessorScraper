const {CheerioUtils} = require("../../sharedUtils/cheerioUtils");

class StreetUtils extends CheerioUtils {
    constructor(link, ...pageData) {
        super(...pageData);
        this.link = link;
    }

    getStreetLinks(){
        const { baseLink, townID } = this.link;
        const $ = this.$;
        const links = $('li.fixedButton a').map((i, a) => {
            return {
                streetLink: `${baseLink}/${$(a).attr('href')}`,
                baseLink,
                townID
            };
        }).get();

        return links;
    }

}

module.exports = {
    StreetUtils
}