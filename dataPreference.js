const puppeteer = require('puppeteer');
const translate = require('translate-google');
const fs = require('fs')

// Function to translate a given text to English
async function translateText(text) {
    try {
        const translatedText = await translate(text, { to: 'en' });
        return translatedText;
    } catch (error) {
        console.error('Error translating content:', error);
        return text; // Return original text in case of error
    }
}

// Function to extract preference data from the cookie dashboard, translate it, and save it to a JSON file
async function dataPreference() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.weeronline.nl/');

    // Click on the 'Manage options' button
    await page.evaluate(() => {
        const button = document.querySelector('.fc-button.fc-cta-manage-options.fc-secondary-button');
        button.click();
    });

    // Wait for the desired changes on the page
    await page.waitForSelector('.fc-preference-container');

    // Extract preference data from cookie dashboard
    const preferenceList = await page.evaluate(() => {
        const preferencesContainer = document.querySelector('.fc-preferences-container');
        return Array.from(preferencesContainer.querySelectorAll('.fc-preference-container'), (e) => ({
            title: e.querySelector('.fc-preference-title h2').innerText,
            description: e.querySelector('.fc-preference-description .fc-purpose-feature-description').innerText,
        }));
    });

    // Translate each title and description
    const translatedPreferenceList = [];
    for (const item of preferenceList) {
        const translatedTitle = await translateText(item.title);
        const translatedDescription = await translateText(item.description);
        translatedPreferenceList.push({
            title: translatedTitle,
            description: translatedDescription
        });
    }

    // Write the translated preference list to a new JSON file
    const translatedPreferenceListJSON = JSON.stringify(translatedPreferenceList, null, 2);
    fs.writeFile('PreferenceList.json', translatedPreferenceListJSON, (err) => {
        if (err) {
            console.error('Error writing translated preference list to file:', err);
        } else {
            console.log('Translated preference list has been saved to translatedPreferenceList.json');
        }
    });

    // Close the Puppeteer browser
    await browser.close();
}

dataPreference();
