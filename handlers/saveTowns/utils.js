'use strict';

const Town = require("../../models/Town");
const { CheerioUtils } = require('../../sharedUtils/cheerioUtils');
const { connectToDB } = require("../../sharedUtils/databaseUtils");
const { convertTownDate } = require("../../sharedUtils/dateUtils");

/**
 * @class The TownUtils class represents the town web page, which can be found at https://www.vgsi.com/massachusetts-online-database/.
 */
class TownUtils extends CheerioUtils {
    /**
     * The constructor for TownUtils
     * @param pageData - the loaded page data
     */
    constructor(pageData){
        super(pageData);
    }

    /**
     * Gets the links for the street pages of the towns that need updating
     * @param townsToUpdate - an array of town names that need updating
     * @returns {[{townLink: string, baseLink: string}]} - an array of townLinks
     */
    getTownLinksToScrape(townsToUpdate) {
        const $ = this.$;

        const townLinksToUpdate = $('td > a').map((i, tableLink) => {
            const potentialLink = $(tableLink);
            const townName = potentialLink.text().split(", ")[0];

            if(townsToUpdate.some(town => townName.includes(town))) {
                let linkToUpdate = tableLink.attribs.href;
                const townLink = linkToUpdate.endsWith('/') ? linkToUpdate.slice(0, -1) : `${linkToUpdate}`;
                const streetsSuffix = 'Streets.aspx';
                return {
                    townLink: `${townLink}/${streetsSuffix}`,
                    baseLink: townLink
                }
            }
        }).get();

        return townLinksToUpdate;
    }

    /**
     * This saves all of the town's names and update times to the database
     * and returns a list of towns that needs to be updated.
     * @returns {[string]} A list of the towns that require updating
     */
    async getTownsToUpdate() {
        const db = await connectToDB();
        const $ = this.$;

        let townPromises = $('tr').map(async (index, element) => {
            if(index !== 0) {
                const tds = $(element).find('td')
                const name = $(tds[0]).text().split(", ")[0];
                const lastUpdated = convertTownDate($(tds[2]).text());
                const savedTown = await Town.findOne({name: name});

                // If the town needs to be created or the town's information has been updated
                if(!savedTown || (savedTown && lastUpdated > savedTown.lastUpdated)) {
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
                    await Town.updateOne(filter, town, options);
                    return name;
                }
            }
            return false;
        }).get();

        return await Promise.all(townPromises).then((towns) => {
            db.close();
            // Only returns the towns that need to be saved by filtering out
            // the ones that did not return a promise
            return towns.filter(Boolean);
        });
    }
}


module.exports = {
    TownUtils
};