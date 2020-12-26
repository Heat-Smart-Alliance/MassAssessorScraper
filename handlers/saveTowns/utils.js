'use strict';

const Town = require("../../models/Town");
const { connectToDB } = require("../../sharedUtils/databaseUtils");
const { convertTownDate } = require("../../sharedUtils/dateUtils");

class TownUtils {
    constructor($){
        this.$ = $;
    }

    getTownLinks() {
        const townLinks = this.$('.bluelink').map((i, elem) => {
            const link = elem.attribs.href;
            const townLink = link.endsWith('/') ? link.slice(0, -1) : `${link}`;
            const streetsSuffix = 'Streets.aspx';
            return {
                townLink: `${townLink}/${streetsSuffix}`,
                baseLink: townLink
            };
        }).get();

        return townLinks;
    }

    async saveTownInformation() {
        const db = await connectToDB();
        const $ = this.$;

        let townPromises = $('tr').map((index, element) => {
            if(index !== 0) {
                const tds = $(element).find('td')
                const name = $(tds[0]).text().split(", ")[0];
                const lastUpdated = convertTownDate($(tds[2]).text());
                const town = {
                    name,
                    lastUpdated
                };
                const filter = {
                    name
                }
                const options = {
                    upsert: true
                }
                return Town.updateOne(filter, town, options);
            }
        }).get();

        await Promise.all(townPromises).then(() => db.close());

    }
}


module.exports = {
    TownUtils
};