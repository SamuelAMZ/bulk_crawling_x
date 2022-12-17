const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// functions imports
const firstLoadPopupResolver = require("./popupChecks/firstLoadPopupResolver");
const getAndStorePeopleInMemory = require("./getAndStoreInMemory/getAndStorePeopleInMemory");
const visitProfile = require("./visitProfiles/visitProfiles");

require("dotenv").config();

const scrapper = async () => {
  //   let time = 0;
  //   let id = setInterval(() => {
  //     time++;
  //     console.log(time);
  //   }, 1000);

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1840,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await page.goto(process.env.ENTRY, {
    waitUntil: "networkidle2",
  });

  //   check if popup apears and close it
  await firstLoadPopupResolver(page);

  //   get and store page items url in memory array
  const peopleLinksArr = await getAndStorePeopleInMemory(page);

  //   visit each profile
  await visitProfile(peopleLinksArr, page);

  //   clearInterval(id);
  //   await browser.close();
};

scrapper();
