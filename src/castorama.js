import puppeteer from 'puppeteer';

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://www.castorama.fr/fenetre-aluminium/cat_id_0003151.cat');

    // Set screen size
    await page.setViewport({width: 1200, height: 1024});


    const consent = '#truste-consent-required';
    try {
        await page.waitForSelector(consent);
        await page.click(consent);
    } catch (e) {
        console.log("Pas de consentement");
    }


    // Wait and click on first result
    const searchResultSelector = '#product-lister';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);
    const lis = await page.$x(
        '//ul[contains(@id,"product-lister")]//li',
    );
    console.log(`${lis.length} elements found`);
    const titles = [];
    for (const li of lis) {
        const regex = /(gris anthracite|gris|blanc) .*?(?:[hH]\.(\d+) x [lL]\.(\d+)|[lL]\.(\d+) x [hH]\.(\d+)) cm/;

        const title = await li.$eval('p', (p) => p.innerText);
        const match = regex.exec(title);
        if (match) {
            titles.push({couleur: match[1], largeur: match[3] || match[5], hauteur: match[2] || match[4]});
        }
    }

    console.log(titles);

    await browser.close();
})();
