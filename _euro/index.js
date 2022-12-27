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
const grabLinks = require("./grabLinks/index");
const visitProfiles = require("./visiteProfiles/index");

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
    args: [`--proxy-server=${proxySession}`],
  });

  const page = await browser.newPage();

  //   user agent
  // Create random user-agent to be set through plugin
  // const userAgentStr = randomUseragent.getRandom(function (ua) {
  //   return parseFloat(ua.browserVersion) >= 20;
  // });
  // console.log(`User Agent: ${userAgentStr}`);
  // await page.setUserAgent(userAgentStr);

  await page.setViewport({
    width: 1840,
    height: 1080,
    deviceScaleFactor: 1,
  });

  // block images and css...
  blockResourcesPlugin.blockedTypes.add("media");
  blockResourcesPlugin.blockedTypes.add("stylesheet");
  blockResourcesPlugin.blockedTypes.add("image");
  blockResourcesPlugin.blockedTypes.add("font");

  // console.log(await page.evaluate("navigator.userAgent"));

  // visit from the top of the archives
  await page.goto("https://www.eurogirlsescort.com/", {
    waitUntil: "networkidle2",
    timeout: 120000,
  });

  // grab links
  // await grabLinks(page);
  await visitProfiles(page);

  await browser.close();
};

// // new ip
const go = async () => {
  const proxySession = newProxy();
  console.log(proxySession);
  await scrapper(proxySession);
};

go();
