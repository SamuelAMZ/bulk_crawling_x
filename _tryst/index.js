// Imports
const newProxy = require("../rotateProxy/rotateProxy");
const { setTimeout } = require("timers/promises");
const firstLoadPopupResolver = require("./popupChecks/firstLoadPopupResolver");
const getAndStorePeopleInMemory = require("./getAndStoreInMemory/getAndStorePeopleInMemory");
const visitProfile = require("./visitProfiles/visitProfiles");
const { newBrowser } = require("./utils/newBrowser");
const { getConfigPuppeteer } = require("./utils/configPuppeteer");
const { newPage } = require("./utils/newPage");
const { connectedToDatabase } = require("./utils/connectedToDatabase");
require("dotenv").config();

// Initialize database connection
connectedToDatabase();

/**
 * Scrapes a given page using a browser and stores data in memory.
 * @param {string} proxySession - Proxy session to use for the browser.
 * @param {number} pageIndex - Index of the random page to scrape.
 */
const scrapper = async (proxySession, pageIndex) => {
  const { puppeteer } = getConfigPuppeteer();

  console.log(`[INFO] Initializing browser for scraping...`);
  const { browser } = (await newBrowser(puppeteer)) || {};
  if (!browser) {
    console.error("[ERROR] Failed to launch browser");
    return;
  }
  console.log(`[INFO] Browser initialized successfully.`);

  const page = await newPage(browser);
  try {
    const targetUrl = `${process.env.TRYST_ENTRY}${pageIndex}`;
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
    }

    await page.goto(targetUrl, {
      waitUntil: "networkidle2",
      timeout: 120000,
    });

    console.log(`[INFO] Resolving pop-ups if present...`);
    await firstLoadPopupResolver(page);

    console.log(`[INFO] Extracting and storing people links...`);
    const peopleLinks = await getAndStorePeopleInMemory(page);

    console.log(`[INFO] Visiting profiles...`);
    const visitStatus = await visitProfile(peopleLinks, page, browser);

    if (visitStatus === "hide") {
      console.log("[INFO] Hiding detected, closing browser...");
    }
  } catch (error) {
    console.error(`[ERROR] Error during scraping: ${error.message}`, {
      proxySession,
    });
  } finally {
    console.log("[INFO] Closing browser...");
    await browser.close();
  }
};

/**
 * Main function to coordinate the scraping process with rotating proxies.
 */
const go = async () => {
  const MAX_ROUNDS = 9;
  const MAX_PAGES = 1066;
  const WAIT_TIME = 20 * 60 * 1000; // 20 minutes
  let roundCount = 0;

  console.log("[INFO] Starting scraping process...");

  for (let pageIndex = 1; pageIndex <= MAX_PAGES; pageIndex++) {
    roundCount++;

    const proxySession = newProxy();
    const randomPage = Math.floor(Math.random() * MAX_PAGES);
    console.log(
      `[INFO] Starting round ${roundCount}, page index: ${randomPage}, proxy: ${proxySession}`
    );
    await scrapper(proxySession, randomPage);

    if (roundCount >= MAX_ROUNDS) {
      console.log(
        `[INFO] Completed ${MAX_ROUNDS} rounds. Sleeping for ${
          WAIT_TIME / 60000
        } minutes...`
      );
      await setTimeout(WAIT_TIME);
      roundCount = 0;
    }
  }

  console.log("[INFO] Scraping process completed.");
};

// Execute the script
go().catch((error) => {
  console.error("[FATAL] Unhandled error in the scraping process:", error);
});
