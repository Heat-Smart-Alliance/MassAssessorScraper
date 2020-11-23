const puppeteer = require("puppeteer");
const { Cluster } = require("puppeteer-cluster");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    await page.goto('https://www.vgsi.com/massachusetts-online-database/');
    let links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("tbody > tr > td > a")).map(link => link.href);
    });

    let sum = 0;

    for (const link of links) {
        console.log(link, "Sum:", sum);
        const linkToStreets = link.endsWith('/') ? `${link}Streets.aspx` : `${link}/Streets.aspx`;

        await page.goto(linkToStreets);
        const letterLinks = await page.evaluate(() => {
            const data = Array.from(document
                .querySelectorAll(".buttonMe > a"))
                .filter(link => link.querySelector("span").innerText != "-")
                .map(link => link.href);
            return data;
        });

        for(const letterLink of letterLinks) {
            console.log(letterLink);
            await page.goto(letterLink);
            const streetLinks = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("#list > li > a")).map(link => link.href);
            });
            for(const streetLink of streetLinks) {
                console.log(streetLink);
                await page.goto(streetLink);
                const homeLinks = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("#list > li > a")).map(link => link.href);
                });
                console.log(homeLinks.length);
                sum += homeLinks.length;
            }
        }
    }
    console.log({
        numberOfTowns: links.length,
        numberOfHouses: sum
    })
    await browser.close();
})();