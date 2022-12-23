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
const firstLoadPopupResolver = require("./popupChecks/firstLoadPopupResolver");
const getAndStorePeopleInMemory = require("./getAndStoreInMemory/getAndStorePeopleInMemory");
const visitProfile = require("./visitProfiles/visitProfiles");

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

const scrapper = async (proxySession, randomPage) => {
  // Create random user-agent to be set through plugin
  // const userAgentStr = randomUseragent.getRandom(function (ua) {
  //   return ua.browserName === "Chrome";
  // });
  // console.log(`User Agent: ${userAgentStr}`);

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
  blockResourcesPlugin.blockedTypes.add("image");
  blockResourcesPlugin.blockedTypes.add("font");

  console.log(randomPage);
  console.log(proxySession);

  // await page.goto("https://whatismyipaddress.com/", {
  //   waitUntil: "networkidle2",
  // });
  // await page.waitForTimeout(2000);

  try {
    await page.goto(`${process.env.ENTRY}${randomPage}`, {
      waitUntil: "networkidle2",
    });

    //   check if popup apears and close it
    await firstLoadPopupResolver(page);
  } catch (error) {
    console.log(error, proxySession);
    await browser.close();
  }
  //   get and store page items url in memory array
  const peopleLinksArr = await getAndStorePeopleInMemory(page);
  //   visit each profile
  const ret = await visitProfile(peopleLinksArr, page);

  if (ret === "hide") {
    return await browser.close();
  }

  await browser.close();
};

// open run 24 times with an ip and then close
// reopen with a new ip for 24 rounds

const go = async () => {
  let round = 0;

  for (let pagesId = 1; pagesId < 662; pagesId++) {
    // count for wait at the 25th
    round++;
    // new ip
    const proxySession = newProxy();
    // random page
    const randomPage = Math.floor(Math.random() * 662);
    // launch
    await scrapper(proxySession, randomPage);

    // if round === 100 wait 20mins
    let TWENTYMINS = 1200000;
    if (round >= 3) {
      console.log("sleeping...");
      await setTimeout(TWENTYMINS);
      round = 0;
    }
  }
};

go();
