const axios = require("axios");
const cheerio = require("cheerio");

/**
 * This function accepts a link
 * @param link - a link for axios to scrape
 * @returns a cheerio object representing the loaded link
 */
async function loadData(link){
    const { data } = await axios.get(link);
    return cheerio.load(data);
}

module.exports = {
    loadData
}