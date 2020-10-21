const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const { Cluster } = require('puppeteer-cluster');
const House = require('../models/House');

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 30,
        monitor: true
    });

    cluster.on('taskerror', (err, data, willRetry) => {
        if (willRetry) {
            console.warn(`Encountered an error while crawling ${data}. ${err.message}\nThis job will be retried`);
        } else {
            console.error(`Failed to crawl ${data}: ${err.message}`);
        }
    });



    const saveHouse = async ({page, data: url }) => {
        await page.goto(url);
        const houseData = await page.evaluate(async () => {
            function getTableElement(table, ...searchTerms){
                const elementText = table.filter(htmlRow => {
                    const actualRow = [...htmlRow.getElementsByTagName('td')]
                    const tableLabel = actualRow[0];
                    const containsTerm = tableLabel && searchTerms.map(searchTerm => tableLabel.innerText.toLowerCase().includes(searchTerm)).some(label => label);
                    return containsTerm
                });
                return elementText && elementText[0].getElementsByTagName("td")[1].innerText;
            }
            const table = Array.from(document.getElementById("MainContent_ctl01_grdCns").rows);
            return {
                owner: document.getElementById("MainContent_lblGenOwner").innerText,
                assessment: document.getElementById("MainContent_lblGenAssessment").innerText,
                salePrice: document.getElementById("MainContent_lblPrice").innerText,
                saleDate: document.getElementById("MainContent_lblSaleDate").innerText,
                yearBuilt: document.getElementById("MainContent_ctl01_lblYearBuilt").innerText,
                occupancy: getTableElement(table, "occupancy"),
                totalRooms: getTableElement(table, "total rooms"),
                style: getTableElement(table, "style"),
                model: getTableElement(table, "model"),
                grade: getTableElement(table, "grade"),
                stories: getTableElement(table, "stories"),
                heatType: getTableElement(table, "heat type", "heating type"),
                heatFuel: getTableElement(table, "heat fuel", "heating fuel"),
                address: `${document.getElementById("MainContent_lblLocation").innerText} ${document.getElementById("lblTownName").innerText}`,
            };
        });
        const house = new House(houseData);
        house.save(function (err) {
            if (err) {
                console.log(err);
            };
            return console.log("Housing Data saved!");
        });
    };

    mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('open database');
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    await page.goto('https://www.vgsi.com/massachusetts-online-database/');
    let links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("tbody > tr > td > a")).map(link => link.href);
    });


     for (const link of links) {
         const linkToStreets = link.endsWith('/') ? `${link}Streets.aspx` : `${link}/Streets.aspx`;

         await page.goto(linkToStreets);
         const letterLinks = await page.evaluate(() => {
             const data = Array.from(document
                 .querySelectorAll(".buttonMe > a"))
                 .filter(link => link.querySelector("span").innerText != "-")
                 .map(link => link.href);
             return data;
         });

         console.log(letterLinks);
         for(const letterLink of letterLinks) {
             await page.goto(letterLink);
             const streetLinks = await page.evaluate(() => {
                 return Array.from(document.querySelectorAll("#list > li > a")).map(link => link.href);
             });
             for(const streetLink of streetLinks) {
                 await page.goto(streetLink);
                 const homeLinks = await page.evaluate(() => {
                     return Array.from(document.querySelectorAll("#list > li > a")).map(link => link.href);
                 });
                 for(const home of homeLinks){
                     await cluster.queue(home, saveHouse);
                 }
             }
         }
         break;
     }

    await cluster.idle();
    await browser.close();
    await cluster.close();
})();
