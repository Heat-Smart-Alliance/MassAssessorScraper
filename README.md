# MassAssessorScraper

## About this project
This is a web scraper which scrapes Massachussets housing data from the 
[Massachusetts Assessor’s Online Database](https://www.vgsi.com/massachusetts-online-database/) using [puppeteer](https://github.com/puppeteer/puppeteer).

Currently, this web scraper only prints out the heating data of the household. 
The goal of this project is to collect as much information as possible, and record that in a MongoDB database, so it can then be pubicly accessible as an API.

## How it works
The web scraper works by going to the [Massachusetts Assessor’s Online Database](https://www.vgsi.com/massachusetts-online-database/)
and accesses every available town listed. It then goes to each town's individual page, and goes through every street from A to Z. From there, it goes through each letter, and accesses its streets.
From the street, we can see what homes are hosted on that street.

## Challenges
The page is not well-formatted (different spelling/inconsistent tables, missing data, etc.). 

Additionally, it is extremely slow to traverse page-by-page and collecting the proper data. 

## Planned Features
- [x] Prove MVP by collecting just heating data
- [ ] Store data locally in MongoDB
- [ ] Store data on an online MongoDB database
- [ ] Add more puppeteer clusters to allow for faster data scraping
- [ ] Dockerize the project
- [ ] Create a cron job to check when the town's data was most recently updated, and rescrape the data/check for changes.
