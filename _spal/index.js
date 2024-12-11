// Imports
const newProxy = require("../rotateProxy/rotateProxy");
const { newBrowser } = require("./utils/newBrowser");
const { getConfigPuppeteer } = require("./utils/configPuppeteer");
const { newPage } = require("./utils/newPage");
const { connectedToDatabase } = require("./utils/connectedToDatabase");
const entry = require("./entry");
const grabLinks = require("./grabLinks");
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

  const page = await newPage(browser);
  try {
    // visit loop one by one entry
    const targetUrl = entry();

    console.log(
      `[INFO] Navigating to ${targetUrl} using proxy: ${proxySession}`
    );

    if (!targetUrl) {
      console.error("[ERROR] target URL can't be null");
      return;
    }

    try {
      new URL(targetUrl?.trim());
    } catch (error) {
      console.error("[ERROR] Invalid URL");
      return;
    }

    try {
      await page.goto(targetUrl, {
        waitUntil: "networkidle2",
        timeout: 120000,
      });
    } catch (error) {
      console.error(`[ERROR] Error during scraping: ${error.message}`, {
        proxySession,
      });
    }

    try {
      console.log("[INFO] Scraping links");
      await grabLinks(page);
    } catch (error) {
      console.error(`[ERROR] Error while scraping links: ${error.message}`);
    }
  } catch (error) {
    console.log(error?.message || error);
    console.error(`[ERROR] Error during scraping: ${error.message}`, {
      proxySession,
    });
  } finally {
    console.log("[INFO] Closing browser...");
    await browser.close();
  }
};

// new ip
const go = async () => {
  const proxySession = newProxy();
  console.log(proxySession);
  console.log("[INFO] Starting scraping process...");
  await scrapper(proxySession);
  console.log("[INFO] Scraping ended...");
};

go();
