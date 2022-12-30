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

// functions imports
const countriesLinks = require("./entry");
const getAndStorePeopleInMemory = require("./grabLinkinMemory/index");
const visitProfiles = require("./visitProfiles/index");

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
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
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

  // block images and css...
  blockResourcesPlugin.blockedTypes.add("media");
  blockResourcesPlugin.blockedTypes.add("stylesheet");
  blockResourcesPlugin.blockedTypes.add("image");
  blockResourcesPlugin.blockedTypes.add("font");
  blockResourcesPlugin.blockedTypes.add("other");

  for (let i = 0; i < countriesLinks.length; i++) {
    // visit loop one by one entry
    await page.goto(countriesLinks[i], {
      waitUntil: "networkidle2",
      timeout: 120000,
    });

    // store in memory
    const people = await getAndStorePeopleInMemory(page);

    // visit profiles loop
    await visitProfiles(page, people);
  }

  await browser.close();
};

// new ip
const go = async () => {
  const proxySession = newProxy();
  console.log(proxySession);
  await scrapper(proxySession);
};

go();
