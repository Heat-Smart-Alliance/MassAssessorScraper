const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.vgsi.com/massachusetts-online-database/');
    const links = await page.evaluate(() => {
       return Array.from(document.querySelectorAll("tbody > tr > td > a")).map(link => link.href);
    });
    for(const link of links){
        const linkToStreets = link.endsWith('/') ? `${link}Streets.aspx` : `${link}/Streets.aspx`;
        await page.goto(linkToStreets);
        const letterLinks = await page.evaluate(() => {
            return Array.from(document
                    .querySelectorAll(".buttonMe > a"))
                    .filter(link => link.querySelector("span").innerText != "-")
                    .map(link => link.href);
        });
        for(const letterLink of letterLinks) {
            await page.goto(letterLink)
            const streetLinks = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("#list > li > a")).map(link => link.href);
            });

            for(const streetLink of streetLinks) {
                await page.goto(streetLink);
                const homeLinks = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("#list > li > a")).map(link => link.href);
                });
                for(const home of homeLinks){
                    await page.goto(home);
                    const heating = await page.evaluate(() => {
                       return {
                           heatType: Array.from(Array.from(document.querySelectorAll(".RowStyle, .AltRowStyle")).filter(row => row.querySelector("td").innerText.includes("Heat Type") || row.querySelector("td").innerText.includes("Heating Type"))[0].querySelectorAll("td"))[1].innerText,
                           heatFuel: Array.from(Array.from(document.querySelectorAll(".RowStyle, .AltRowStyle")).filter(row => row.querySelector("td").innerText.includes("Heat Fuel") || row.querySelector("td").innerText.includes("Heating Fuel"))[0].querySelectorAll("td"))[1].innerText
                       }
                    });
                    console.log(heating);
                }
            }
        }
    }
    await browser.close();
})();
