const cheerio = require('cheerio');
const axios = require('axios');

const PromisePool = require('@supercharge/promise-pool');

const mongoose = require('mongoose');
const House = require('../models/House');

Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    }
});

Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        var R = [];
        for (var i = 0; i < this.length; i += chunkSize)
            R.push(this.slice(i, i + chunkSize));
        return R;
    }
});

async function scrapeHouses() {
    const db = mongoose.connection;
    const base = 'https://www.vgsi.com/massachusetts-online-database/';
    const {data} = await axios.get(base);
    const $ = cheerio.load(data);

    let townLinks = $('.bluelink').map((i, elem) => {
        const link = elem.attribs.href;
        const townLink = link.endsWith('/') ? link.slice(0, -1) : `${link}`;
        const streetsSuffix = 'Streets.aspx';
        return {
            townLink: `${townLink}/${streetsSuffix}`,
            baseLink: townLink
        };
    }).get();

    townLinks = townLinks.slice(0, 1).chunk(1);
    console.log(townLinks);

    let townPromises = townLinks.map(async (townLinks) => {
        const { results, errors } = await PromisePool
            .for(townLinks)
            .withConcurrency(3)
            .process(async ({townLink, baseLink}) => {
                const { data } = await axios.get(townLink);
                const $ = cheerio.load(data);
                const links = $('div.buttonMe a').map((i, a) => {
                    return {
                        letterLink: `${baseLink}/${$(a).attr('href')}`,
                        baseLink: baseLink
                    }
                }).get();
                return links;
            });
        return results;
    });

    let letterLinks = await Promise.all(townPromises);
    letterLinks = letterLinks.flat();
    console.log(letterLinks);

    let streetPromises = letterLinks.map(async letterLinks => {
        const { results, errors } = await PromisePool
            .for(letterLinks)
            .withConcurrency(5)
            .handleError(async (error, data) => {
                console.log("Street Promises error:", data, error);
            }).process(async ({letterLink, baseLink}) => {
                const {data} = await axios.get(letterLink);
                const $ = cheerio.load(data);
                const links = $('li.fixedButton a').map((i, a) => {
                    return {
                        streetLink: `${baseLink}/${$(a).attr('href')}`,
                        baseLink
                    };
                }).get();
                return links;
            })
        return results;
    });

    let streetLinks = await Promise.all(streetPromises);

    // TODO: Remove slicing in order to not limit the number of houses
    streetLinks = streetLinks.flat(2);
    console.log(streetLinks);
    let housePromises = streetLinks.chunk(10).map(async streets => {
        const { results, errors } = await PromisePool
            .for(streets)
            .withConcurrency(3)
            .handleError(async error => {
                console.log(`House Promises Error: ${error}`);
            })
            .process(async ({baseLink, streetLink}) => {
                const { data } = await axios.get(streetLink);
                const $ = cheerio.load(data);
                const links = $('#list > li > a').map((i, a) => {
                    return `${baseLink}/${$(a).attr('href')}`
                }).get();
                console.log(links);
                return links;
            })
        return results;
    });

    let houseLinks = await Promise.all(housePromises);
    houseLinks = houseLinks.flat(2).chunk(100);
    console.log(houseLinks);

    let databasePromises = houseLinks.map(async houses => {
        const { results, errors } = await PromisePool
            .for(houses)
            .withConcurrency(2)
            .handleError(async error => {
                console.log(`Error saving to the database:`, error);
            })
            .process(async houseLink => {
                const { data } = await axios.get(houseLink);
                const $ = cheerio.load(data);
                console.log("House Link: ", houseLink);
                const houseData = {
                    address: `${$("#MainContent_lblLocation").text()} ${$("#lblTownName").text()}`
                };
                return houseData;
            });
        return results;
    });

    let houses = await Promise.all(databasePromises);
    console.log(houses);
    db.close();
}

(async function () {
    try {
        const DATABASE_NAME = "test";
        const DATABASE_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;
        await mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Connecting! Starting to scrape houses now!");
            scrapeHouses();
        }).catch(e => console.log(e));
        const db = mongoose.connection;
    } catch (e) {
        console.log('Bad Error', e);
    }
})();