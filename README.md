# MassAssessorScraper

## Local Installation
This project requires an installation of Docker, Docker Compose and Serverless Offline to run locally.

## About this project
This is a web scraper which scrapes Massachusetts housing data from the 
[Massachusetts Assessor’s Online Database](https://www.vgsi.com/massachusetts-online-database/) using 
[cheerio](https://cheerio.js.org/).

Currently, this web scraper only prints out the heating data of the household. 
The goal of this project is to collect as much information as possible, and record that in a Mongo 
database, so it can then be publicly accessible as an API.

## How it works
The web scraper works by going to the 
[Massachusetts Assessor’s Online Database](https://www.vgsi.com/massachusetts-online-database/)
and accesses every available town listed. It then goes to each town's individual page, and goes through every street 
from A to Z. From there, it goes through each letter, and accesses its streets.
From the street, we can see what homes are hosted on that street.

## Challenges
The page is not well-formatted (different spelling/inconsistent tables, missing data, etc.). 

Additionally, it is extremely slow to traverse page-by-page and collecting the proper data. 
