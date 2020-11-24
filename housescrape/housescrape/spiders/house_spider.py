import scrapy

class HouseSpider(scrapy.Spider):
    name = "houses"

    start_urls = [
        'https://www.vgsi.com/massachusetts-online-database/'
    ]

    def get_houses(self, response):
        base_link = response.meta.get('base_link')
        house_links = map(lambda link: base_link + "/" + link, response.css('ul#list > li > a::attr(href)').getall())
        print(house_links)

    def get_streets(self, response):
        base_link = response.meta.get('base_link')
        street_links = map(lambda link: base_link + "/" + link, response.css('ul.fixedButton > li > a::attr(href)').getall())
        for street in street_links:
            next_page = response.urljoin(street)
            yield scrapy.Request(next_page, callback=self.get_houses, meta={'base_link': base_link})

    def get_letters(self, response):
        base_link = response.meta.get("base_link")
        letter_links = map(lambda link: base_link + "/" + link, response.css('.buttonMe a::attr(href)').getall())
        for letter in letter_links:
            next_page = response.urljoin(letter)
            yield scrapy.Request(next_page, callback=self.get_streets, meta={'base_link': base_link})

    def parse(self, response):
        links = response.css('.bluelink::attr(href)').getall()
        suffix = "Streets.aspx"
        towns = map(lambda link: {"street_link": link + suffix, "base_link": link[:-1]} if link.endswith('/') else {"street_link": link + "/" + suffix, "base_link": link}, links)
        for town in towns:
            next_page = response.urljoin(town["street_link"])
            print(town["base_link"])
            yield scrapy.Request(next_page, callback=self.get_letters, meta={'base_link': town["base_link"]})


    