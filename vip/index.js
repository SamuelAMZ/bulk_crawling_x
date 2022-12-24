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
const firstLoadPopupResolver = require("./closePopup/index");
const grabInfo = require("./grabDetails/index");
const nextPage = require("./next/index");
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
  blockResourcesPlugin.blockedTypes.add("stylesheet");
  blockResourcesPlugin.blockedTypes.add("image");
  blockResourcesPlugin.blockedTypes.add("font");
  blockResourcesPlugin.blockedTypes.add("xhr");

  try {
    await page.goto(`${process.env.ENTRYVIP}`, {
      waitUntil: "networkidle2",
    });

    //   check if popup apears and close it
    await firstLoadPopupResolver(page);
    await page.waitForTimeout(500);
  } catch (error) {
    console.log(error, proxySession);
  }

  while (true) {
    // check if it needs to be added or not
    const currentPage = await page.url();
    const isNeeded = await checkIndependant(currentPage);

    if (isNeeded) {
      console.log(currentPage + " already");
      try {
        await nextPage(page);
      } catch (error) {
        console.log(error);
        await browser.close();
      }
    }

    //grab details
    try {
      const data = await grabInfo(page);
      // add to db
      await addNewIndependant(data[0]);
    } catch (error) {
      console.log(error);
    }

    //   next page
    try {
      await nextPage(page);
    } catch (error) {
      console.log(error);
      await browser.close();
    }
  }
};

// new ip
const go = async () => {
  const proxySession = newProxy();
  await scrapper(proxySession);
};

go();
