const fs = require('fs');
const { Parser } = require('json2csv');
const axios = require('axios');
const { JSDOM } = require('jsdom');

async function scrapeWebsite(url) {
  try {
    const { data: html } = await axios.get(url);
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const books = document.querySelectorAll('.product_pod');

    const scrapedData = [];

    books.forEach((book) => {
      const title = book.querySelector('h3 a').getAttribute('title');
      const price = book.querySelector('.price_color').textContent;

      scrapedData.push({
        Title: title,
        Price: price,
      });
    });

    // Convert JSON to CSV
    const parser = new Parser();
    const csv = parser.parse(scrapedData);

    // Write the data to a CSV file
    fs.writeFileSync('scrapedData.csv', csv);
    console.log('Data has been written to scrapedData.csv');
  } catch (error) {
    console.error('Error fetching the page:', error);
  }
}

scrapeWebsite('https://books.toscrape.com/');
