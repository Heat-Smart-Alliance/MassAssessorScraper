const { connectToDB } = require("../../sharedUtils/databaseUtils");
const { CheerioUtils } = require("../../sharedUtils/cheerioUtils");
const Town = require("../../models/Town");

class SingleTownUtils extends CheerioUtils {
    constructor(...pageData) {
        super(...pageData);
    }

    async getTownData(townName) {
            const $ = this.$;
            const linkToScrape = $('a.bluelink').filter((i, elem) => $(elem).text().toLowerCase().includes(townName.toLowerCase())).attr('href')
            if(!linkToScrape) {
                return {
                    status: 200,
                    message: `Town ${townName} was not found!`
                }
            } else {
                const db = await connectToDB();
                const townLink = linkToScrape.endsWith('/') ? linkToScrape.slice(0, -1) : `${linkToScrape}`;

                const name = townName.charAt(0).toUpperCase() + townName.slice(1).toLowerCase();
                const savedTown = await Town.findOne({name: name});

                const streetsSuffix = 'Streets.aspx';

                // If there was no saved town
                if(!savedTown) {
                    const id = await Town.create({
                        name: name,
                        lastUpdated: Date.now()
                    }).then(town => town._id).catch(e => console.log("Error getting single town:", e));
                    db.close();
                    return [{
                        baseLink: townLink,
                        townLink: `${townLink}/${streetsSuffix}`,
                        townID: id
                    }]

                } else {
                    db.close();
                    return [{
                        baseLink: townLink,
                        townLink: `${townLink}/${streetsSuffix}`,
                        townID: savedTown._id
                    }]
                }
            }
    }

}

module.exports = {
    SingleTownUtils
}