const axios = require("axios");
const cheerio = require("cheerio");

/**
 * This function accepts a link
 * @param link - a link for axios to scrape
 * @returns a cheerio object representing the loaded link
 */
async function loadData(link){
    try {
        const { data } = await axios.get(link)
        return cheerio.load(data);
    } catch(e) {
        return null;
    }
}

/**
 * @class The CheerioUtils class is used as a parent class for each page. It accepts a page data as an argument, and
 * sets it in the constructor
 */
class CheerioUtils {
    constructor(pageData) {
        this.pageData = pageData;
    }

    /**
     * $ is a getter for the loaded cheerio data
     * @returns the loaded cheerio page data
     */
    get $(){
        return this.pageData;
    }
}

module.exports = {
    loadData,
    CheerioUtils
}