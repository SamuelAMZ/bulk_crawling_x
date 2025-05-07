// functions imports
const firstLoadPopupResolver = require("./closePopup/index");
const cloudflareBypass = require("./cloudflareBypass/index");

// Imports
const newProxy = require("../rotateProxy/rotateProxy");
const { newBrowser } = require("./utils/newBrowser");
const { getConfigPuppeteer } = require("./utils/configPuppeteer");
const { newPage } = require("./utils/newPage");
const { connectedToDatabase } = require("./utils/connectedToDatabase");
const entry = require("./entry");
const grabLinks = require("./grablinks");
require("dotenv").config();

// Initialize database connection
connectedToDatabase();

/**
 * Scrapes a given page using a browser and stores data in memory.
 * @param {string} proxySession - Proxy session to use for the browser.
 */
const scrapper = async (proxySession) => {
  const { puppeteer } = getConfigPuppeteer();

  console.log(`[INFO] Initializing browser for scraping...`);
  const { browser } = (await newBrowser(puppeteer, proxySession)) || {};
  if (!browser) {
    console.error("[ERROR] Failed to launch browser");
    return;
  }
  console.log(`[INFO] Browser initialized successfully.`);

  const context = await browser.createIncognitoBrowserContext();

  // const page = await context.newPage();
  const page = await newPage(browser);

  // await page.authenticate({ username: "jwvcqoqc", password: "z5dc7uri8t3t" });

  // visit from the top of the archives
  const targetUrl = entry();
  await page.goto(targetUrl, {
    waitUntil: "networkidle2",
    timeout: 120000,
  });
  await page.waitForTimeout(2000);

  try {
    //   close popup
    await firstLoadPopupResolver(page);
  } catch (error) {
    console.log("[ERROR] failed to close popup", error.message);
  }

  try {
    console.log("[INFO] Scraping links");
    await grabLinks(page);
  } catch (error) {
    console.error(`[ERROR] Error while scraping links: ${error.message}`);
  }

  // // cloudflare bypass
  // // const newInstance = await cloudflareBypass(page, browser);

  // // if (newInstance.status === "ok") {
  // //   console.log("[INFO] cloudflare bypass");
  //   try {
  //     //   close popup
  //     await firstLoadPopupResolver(page);

  //     await page.waitForTimeout(3000);

  //     // grab links
  //     // await grabLinks(page);

  //     // visit profile and grab details
  //     const ret = await visitProfiles(page);

  //     if (ret === "hide") {
  //       return await browser.close();
  //     }
  //   } catch (error) {
  //     console.log(error?.message || error);
  //   }

  //   await newInstance.b.close();
  // // } else {
  // //   await newInstance.b.close();
  // // }
};

// // new ip
const go = async () => {
  for (let pagesId = 0; pagesId < 30000; pagesId++) {
    // new ip
    const proxySession = newProxy();
    console.log(proxySession);
    // launch
    await scrapper(proxySession);
  }
};

go();
