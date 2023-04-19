const puppeteer = require("puppeteer");
require("dotenv").config();
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.pepal.eu/");
  try {
    await page.type("#username", process.env.USERNAME_PEPAL);
    await page.type("#password", process.env.PASSWORD_PEPAL);
    await page.click("#login_btn");
  } catch (error) {
    console.error(error);
  }

  const searchResultSelector = ".btn.red";
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);
  const buttonSelector =
    hours >= 9 && (hours < 12 || (hours === 12 && minutes <= 30))
      ? `/html/body/div[3]/div/div/div[5]/div/div[1]/div[2]/table/tbody/tr[1]/td[3]/a`
      : hours >= 13 && hours <= 17
      ? `/html/body/div[3]/div/div/div[5]/div/div[1]/div[2]/table/tbody/tr[2]/td[3]/a`
      : null;
  if (buttonSelector) {
    const [button] = await page.$x(buttonSelector); // Utilisation de destructuring pour extraire le premier élément du tableau
    if (button) {
      await button.click();
    } else {
      console.error("Le bouton n'a pas été trouvé");
    }
  } else {
    console.error("Hors cours");
    await browser.close();
  }
  while (true) {
    await page.reload({ waitUntil: "networkidle0" });
    try {
      await page.waitForSelector(".btn-success", { timeout: 1000 });
      break; // Sortir de la boucle si le bouton est présent
    } catch (error) {
      console.log(
        "Le bouton n'est pas encore présent, rechargement de la page..."
      );
    }
  }
  await page.click(".btn-success");
})();
