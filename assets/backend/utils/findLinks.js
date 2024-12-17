const puppeteer = require('puppeteer');


//Find all div elements with class 'bkWMgd'
const searchResults = await page.$$eval('div[class=bkWMgd]', results => {
    //Array to hold all our results
    let data = [];

    //Iterate over all the results
    results.forEach(parent => {

        //Check if parent has h2 with text 'Web Results'
        const ele = parent.querySelector('h2');

        //If element with 'Web Results' Title is not found  then continue to next element
        if (ele === null) {
            return;
        }

        //Check if parent contains 1 div with class 'g' or contains many but nested in div with class 'srg'
        let gCount = parent.querySelectorAll('div[class=g]');

        //If there is no div with class 'g' that means there must be a group of 'g's in class 'srg'
        if (gCount.length === 0) {
            //Targets all the divs with class 'g' stored in div with class 'srg'
            gCount = parent.querySelectorAll('div[class=srg] > div[class=g]');
        }

        //Iterate over all the divs with class 'g'
        gCount.forEach(result => {

            //Target the url
            const url = result.querySelector('div[class=rc] > div[class=r] > a').href;

            //Add to the return Array
            data.push(url);
        });
    });

    //Return the search results
    return data;
});

  //https://dev.to/waqasabbasi/building-a-search-engine-api-with-node-express-and-puppeteer-using-google-search-4m21