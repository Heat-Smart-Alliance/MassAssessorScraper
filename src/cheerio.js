const cheerio = require('cheerio');
const axios = require('axios');
const PromisePool = require('@supercharge/promise-pool');

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

(async function () {
    try {
        const base = 'https://www.vgsi.com/massachusetts-online-database/';
        const {data} = await axios.get(base);
        const $ = cheerio.load(data);

        const townLinks = $('.bluelink').map((i, elem) => {
            const link = elem.attribs.href;
            const townLink = link.endsWith('/') ? link.slice(0, -1) : `${link}`;
            const streetsSuffix = 'Streets.aspx';
            return {
                townLink: `${townLink}/${streetsSuffix}`,
                baseLink: townLink
            };
        }).get();

        let letterLinks = await Promise.all(townLinks.map(async ({townLink, baseLink}) => {
            try {
                const {data} = await axios.get(townLink);
                const $ = cheerio.load(data);
                const links = $('div.buttonMe a').map((i, a) => {
                    return {
                        letterLink: `${baseLink}/${$(a).attr('href')}`,
                        baseLink: baseLink
                    }
                }).get();
                return links;
            } catch (e) {
                console.log("letter link error", townLink, e);
            }
        }));

        letterLinks = letterLinks.filter(link => link).flat();

        let streetLinks = await Promise.all(letterLinks.map(async ({baseLink, letterLink}) => {
            try {
                const {data} = await axios.get(letterLink);
                const $ = cheerio.load(data);
                const links = $('li.fixedButton a').map((i, a) => {
                    return {
                        streetLink: `${baseLink}/${$(a).attr('href')}`,
                        baseLink
                    };
                }).get();
                return links;
            } catch (e) {
                console.log('street link error', letterLink, e)
            }
        }));

        streetLinks = streetLinks.filter(link => link).flat().chunk(500);

        console.log("Chunk Length", streetLinks.length);
        let houseLinks = [];
        let chunk = 0;
        for(let streets of streetLinks) {
            console.log(`On chunk: ${++chunk}`);
            const {results, errors} = await PromisePool
                .for(streets)
                .withConcurrency(500)
                .handleError(async (error, user) => {
                    console.log("Housing links error", error);
                })
                .process(async ({baseLink, streetLink}) => {
                    const {data} = await axios.get(streetLink);
                    const $ = cheerio.load(data);
                    const links = $('#list > li > a').map((i, a) => {
                        return `${baseLink}/${$(a).attr('href')}`;
                    }).get();
                    return links;
                });
            houseLinks.push(results);
            console.log(results);
            console.log(errors);
        }

        houseLinks = houseLinks.flat(2).chunk(10000);
        let houseChunk = 0;
        for(let houses of houseLinks){
            console.log(`On house chunk ${++houseChunk} of ${houseLinks.length}`);
            const { result, errors } = await PromisePool
                .for(houses)
                .withConcurrency(1000)
                .handleError(async (error, user) => {
                    console.log("Housing links error", error);
                })
                .process(async link => {
                   const { data } = await axios.get(link);
                   const $ = cheerio.load(data);
                   
                });
        }
        console.log("House links are now flattened", houseLinks);

    } catch (e) {
        console.log('Bad Error', e);
    }
})();