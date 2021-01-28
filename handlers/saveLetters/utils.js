const { CheerioUtils } = require("../../sharedUtils/cheerioUtils");


class LetterUtils extends CheerioUtils {
    constructor(link, ...pageData) {
        super(...pageData);
        this.link = link;
    }

    /**
     * getLetterLinks returns the an object representing the town link and the link to the page with streets starting
     * with a letter A through Z.
     *
     * Example: https://gis.vgsi.com/<town-name>/Streets.aspx?Letter=<A-Z>
     *
     * @returns an array of objects
     */
    getLetterLinks() {
        const { baseLink } = this.link;
        const $ = this.$;
        const links = $('div.buttonMe a').map((i, a) => {
            return {
                letterLink: `${baseLink}/${$(a).attr('href')}`,
                baseLink: baseLink
            }
        }).get();
        return links;
    }

}

module.exports = {
    LetterUtils
};