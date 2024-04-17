const puppeteer = require('puppeteer');
const translate = require('translate-google');

async function translateText(text) {
    try {
        const translatedText = await translate(text, { to: 'en' });
        return translatedText;
    } catch (error) {
        console.error('Error translating content:', error);
        return text; // Return original text in case of error
    }
}

async function scrapeAndTranslate() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.weeronline.nl/');

    // Scrape text from the webpage
    const scrapedTitle = await page.evaluate(() => {
        return document.querySelector('.fc-dialog-headline').innerText;
    });

    console.log("scrapedTitle");
    // console.log(scrapedTitle);
    // Translate the scraped text
    const translatedText = await translateText(scrapedTitle);
    // console.log('Translated text:', translatedText);

    await browser.close();
}

scrapeAndTranslate();