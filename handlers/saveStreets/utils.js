const {CheerioUtils} = require("../../sharedUtils/cheerioUtils");

class StreetUtils extends CheerioUtils {
    constructor(link, ...pageData) {
        super(...pageData);
        this.link = link;
    }

    getStreetLinks(){
        const { baseLink } = this.link;
        const $ = this.$;
        const links = $('li.fixedButton a').map((i, a) => {
            return {
                streetLink: `${baseLink}/${$(a).attr('href')}`,
                baseLink
            };
        }).get();

        return links;
    }

}

module.exports = {
    StreetUtils
}