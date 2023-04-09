const puppeteer = require("puppeteer");
require("dotenv").config();

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.pepal.eu/");
  await page.type("#username", process.env.USERNAME);
  await page.type("#password", process.env.PASSWORD);
  await page.click("#login_btn");
  const searchResultSelector = ".btn.red";
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  console.log("It's good");
  /*await browser.close();*/
})();
