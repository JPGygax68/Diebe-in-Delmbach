import puppeteer from "puppeteer";
import fs from "fs";

// Puppeteer needs the full path to our HMTL file
const fullinputpath = fs.realpathSync("cards_3x3_a4.html");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`file://${fullinputpath}`, {
    waitUntil: "networkidle0"
  });

  const html = await page.content();
  fs.writeFileSync("output-static.html", html);

  await browser.close();
})();
