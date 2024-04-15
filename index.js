const puppeteer = require('puppeteer')

async function run (){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.weeronline.nl/')

    await browser.close()
}

run()