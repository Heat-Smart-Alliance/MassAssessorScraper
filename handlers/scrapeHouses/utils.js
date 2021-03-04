const { singleSpaces } = require("../../sharedUtils/stringUtils");
const { CheerioUtils } = require("../../sharedUtils/cheerioUtils");

class ScraperUtils extends CheerioUtils {
    constructor(link, ...pageData) {
        super(...pageData);
        this.link = link;
    }

    getTableElement(table, ...searchTerms){
        const elementText = table.filter(htmlRow => {
            const actualRow = [...htmlRow.getElementsByTagName('td')]
            const tableLabel = actualRow[0];
            const containsTerm = tableLabel && searchTerms.map(searchTerm => tableLabel.innerText.toLowerCase().includes(searchTerm)).some(label => label);
            return containsTerm
        });
        return elementText && elementText[0].getElementsByTagName("td")[1].innerText;
    }

    getPageContent() {
        const $ = this.$;
        const { townID } = this.link;
        const data = {
            townID,
            owner: $("#MainContent_lblGenOwner").text(),
            assessment:$("#MainContent_lblGenAssessment").text(),
            salePrice: $("#MainContent_lblPrice").text(),
            saleDate: $("#MainContent_lblSaleDate").text(),
            yearBuilt: $("#MainContent_ctl01_lblYearBuilt").text(),
            pid: $("#MainContent_lblPid").text(),
            address: singleSpaces(`${$("#MainContent_lblLocation").text()} ${$("#lblTownName").text()}`)
        }
        return data;
    }
}

module.exports = {
    ScraperUtils
}