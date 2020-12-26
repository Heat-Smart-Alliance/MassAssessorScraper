const axios = require("axios");
const cheerio = require("cheerio");

async function loadData(link){
    const { data } = await axios.get(link);
    return cheerio.load(data);
}

module.exports = {
    loadData
}