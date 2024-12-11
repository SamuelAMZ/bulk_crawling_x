// Proxy provider
const newProxy = require("../rotateProxy/rotateProxy");

// Function imports
const entry = require("./entry");
const firstLoadPopupResolver = require("./closePopup/index");
const pageLinks = require("./grabLinksInMemory/index");
const grabDetails = require("./grabDetails/index");
const checkIndependant = require("../db/checkIndependant");
const addNewIndependant = require("../db/addNewIndependant");

const { newBrowser } = require("./utils/newBrowser");
const { getConfigPuppeteer } = require("./utils/configPuppeteer");
const { newPage } = require("./utils/newPage");
const { connectedToDatabase } = require("./utils/connectedToDatabase");
require("dotenv").config();

// Initialize database connection
connectedToDatabase();

/**
 * Validates the provided URL.
 * @param {string} url - URL to validate.
 * @returns {boolean} - Returns true if valid, false otherwise.
 */
const validateUrl = (url) => {
  try {
    new URL(url.trim());
    return true;
  } catch {
    console.error(`[ERROR] Invalid URL: ${url}`);
    return false;
  }
};

/**
 * Main scraping function.
 * @param {string} proxySession - Proxy session to use for browser instance.
 */
const scrapper = async (proxySession) => {
  const { puppeteer } = getConfigPuppeteer();
  console.log(`[INFO] Initializing browser with proxy: ${proxySession}...`);

  const { browser } = (await newBrowser(puppeteer, proxySession)) || {};
  if (!browser) {
    console.error("[ERROR] Failed to launch browser.");
    return;
  }
  console.log("[INFO] Browser initialized successfully.");

  const page = await newPage(browser);

  try {
    const targetUrl = entry();

    console.log(`[INFO] Processing URL: ${targetUrl}`);

    if (!targetUrl) {
      console.warn("[WARN] Target URL is null or undefined. Skipping...");
      return;
    }

    if (!validateUrl(targetUrl)) {
      console.warn(`[WARN] Skipping invalid URL: ${targetUrl}`);
      return;
    }

    try {
      await page.goto(targetUrl, { waitUntil: "networkidle2" });
      console.log(`[INFO] Successfully navigated to ${targetUrl}`);
    } catch (error) {
      console.error(
        `[ERROR] Failed to navigate to ${targetUrl}: ${error.message}`
      );
      return;
    }

    try {
      await firstLoadPopupResolver(page);
      console.log("[INFO] Popup resolved successfully.");
    } catch (error) {
      console.error(`[ERROR] Failed to resolve popup: ${error.message}`);
    }

    let linkArray = [];
    try {
      linkArray = await pageLinks(page);
      console.log(
        `[INFO] Extracted ${linkArray.length} links from ${targetUrl}`
      );
    } catch (error) {
      console.error(`[ERROR] Failed to grab page links: ${error.message}`);
      return;
    }

    for (const link of linkArray) {
      console.log(`[INFO] Processing link: ${link}`);
      try {
        const isNeeded = await checkIndependant(link);
        if (isNeeded) {
          console.log(`[INFO] Link already exists in the database: ${link}`);
          continue;
        }

        await page.goto(link, { waitUntil: "networkidle2" });
        console.log(`[INFO] Navigated to profile link: ${link}`);

        const data = await grabDetails(page);
        console.log("[INFO] Profile details grabbed successfully.");

        await addNewIndependant(data[0]);
        console.log("[INFO] New profile added to the database.");
      } catch (error) {
        console.error(
          `[ERROR] Error processing link ${link}: ${error.message}`
        );
      }
    }
  } catch (error) {
    console.error(`[FATAL] Scrapper encountered an error: ${error.message}`);
  } finally {
    console.log("[INFO] Closing browser.");
    await browser.close();
  }
};

/**
 * Initiates the scraping process with a new proxy session.
 */
const go = async () => {
  try {
    const proxySession = newProxy();
    console.log(`[INFO] Proxy session initiated: ${proxySession}`);
    await scrapper(proxySession);
  } catch (error) {
    console.error(
      `[FATAL] Unhandled error in scraping process: ${error.message}`
    );
  }
};

// Start the scraping process
go();
