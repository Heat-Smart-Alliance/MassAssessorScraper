const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const { Cluster } = require('puppeteer-cluster');
const House = require('../models/House');

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 15,
        monitor: true
    });

    const saveHouse = async ({page, data: url }) => {
        console.log(`Going to home at: ${url}`);
        await page.goto(url);
        const houseData = await page.evaluate(async () => {
            return {
                heatType: Array.from(Array.from(document.querySelectorAll(".RowStyle, .AltRowStyle")).filter(row => row.querySelector("td").innerText.includes("Heat Type") || row.querySelector("td").innerText.includes("Heating Type"))[0].querySelectorAll("td"))[1].innerText,
                heatFuel: Array.from(Array.from(document.querySelectorAll(".RowStyle, .AltRowStyle")).filter(row => row.querySelector("td").innerText.includes("Heat Fuel") || row.querySelector("td").innerText.includes("Heating Fuel"))[0].querySelectorAll("td"))[1].innerText
            };
        });
        const house = new House(houseData);
        house.save(function (err) {
            if (err) return console.log(err);
            return console.log("Housing Data saved!");
        });
    };


    const visitStreet = async ({ page, data: url }) => {
        console.log(`Going to ${url}`);
        await page.goto(url);
        console.log("Found data at URL");
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
                    console.log(`Queueing home at ${home}`);
                    await cluster.queue(home, saveHouse);
                }
            }
        }
    };

    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();

    mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('open database');
    });

    cluster.queue(async ({page}) => {
        await page.goto('https://www.vgsi.com/massachusetts-online-database/');
        let links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("tbody > tr > td > a")).map(link => link.href);
        });
        for (const link of links) {
            const linkToStreets = link.endsWith('/') ? `${link}Streets.aspx` : `${link}/Streets.aspx`;
            await cluster.queue(linkToStreets, visitStreet);
            break;
        }
    })

    await cluster.idle();
    await cluster.close();
})();
