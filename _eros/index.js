const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// ressource blocker
const blockResourcesPlugin =
  require("puppeteer-extra-plugin-block-resources")();
puppeteer.use(blockResourcesPlugin);

// user agent plugin
const UserAgent = require("user-agents");
const randomUseragent = require("random-useragent");

// proxy provider
const newProxy = require("../rotateProxy/rotateProxy");

// node built in waiter
const { setTimeout } = require("timers/promises");

// functions imports
const entry = require("./entry");
const firstLoadPopupResolver = require("./closePopup/index");
const pageLinks = require("./grabLinksInMemory/index");
const grabDetails = require("./grabDetails/index");
const checkIndependant = require("../db/checkIndependant");
const addNewIndependant = require("../db/addNewIndependant");

require("dotenv").config();

// connect to db
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DBURI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to db");
  }
});

const scrapper = async (proxySession) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
      `--proxy-server=${proxySession}`,
    ],
  });

  const page = await browser.newPage();
  // await page.setUserAgent(userAgentStr);

  await page.setViewport({
    width: 1840,
    height: 1080,
    deviceScaleFactor: 1,
  });

  // console.log(await page.evaluate("navigator.userAgent"));

  // block images and css...
  blockResourcesPlugin.blockedTypes.add("media");
  blockResourcesPlugin.blockedTypes.add("stylesheet");
  blockResourcesPlugin.blockedTypes.add("image");
  blockResourcesPlugin.blockedTypes.add("font");

  //   get entry array randomly to be able to scrap in multiple tabs
  const newEntry = entry()[Math.floor(Math.random() * 6)];

  for (let entrylink = 0; entrylink < newEntry.length; entrylink++) {
    // visit from the top of the archives
    await page.goto(newEntry[entrylink], {
      waitUntil: "networkidle2",
    });

    //   close popup
    await firstLoadPopupResolver(page);

    // grab pages links and paginate if exist
    // return links in array
    const linkArray = await pageLinks(page);

    // go to all pages links in arr one by one
    for (let link = 0; link < linkArray.length; link++) {
      // check if it needs to be added or not
      const currentPage = linkArray[link];
      const isNeeded = await checkIndependant(currentPage);
      if (isNeeded) {
        console.log(currentPage + " already");
        continue;
      }
      // visit profile func
      await page.goto(linkArray[link], {
        waitUntil: "networkidle2",
      });
      //   gab details
      const data = await grabDetails(page);
      //   add to db
      await addNewIndependant(data[0]);
    }
  }
  await browser.close();
};

// // new ip
const go = async () => {
  const proxySession = newProxy();
  console.log(proxySession);
  await scrapper(proxySession);
};

go();
