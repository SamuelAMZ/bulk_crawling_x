const newProxy = require("../rotateProxy/rotateProxy");
const grabLinks = require("./grabLinks/index");
const cloudflareBypass = require("./cloudflareBypass/index");

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
    return false;
  }
};

/**
 * Handles the scraping process for a given target URL and proxy session.
 * @param {string} proxySession - Proxy session to use for the browser.
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
  const targetUrl = "https://escortnews.eu";

  if (!targetUrl) {
    console.error("[ERROR] Target URL cannot be null.");
    await browser.close();
    return;
  }

  if (!validateUrl(targetUrl)) {
    console.error("[ERROR] Invalid target URL.");
    await browser.close();
    return;
  }

  try {
    console.log(`[INFO] Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, {
      waitUntil: "networkidle2",
      timeout: 120000,
    });

    console.log(`[INFO] Attempting to bypass Cloudflare for ${targetUrl}...`);
    const newInstance = await cloudflareBypass(page, browser);

    if (newInstance.status === "ok") {
      console.log("[INFO] Successfully bypassed Cloudflare.");
      try {
        console.log("[INFO] Visiting profiles...");
        await grabLinks(newInstance.p);
      } catch (error) {
        console.error(
          `[ERROR] Error while visiting profiles: ${error.message}`
        );
      }
    } else {
      console.error("[ERROR] Cloudflare bypass failed.");
    }

    console.log("[INFO] Closing browser instance...");
    await newInstance.b.close();
  } catch (error) {
    console.error(`[ERROR] Error during scraping process: ${error.message}`);
  } finally {
    console.log("[INFO] Closing main browser...");
    await browser.close();
  }
};

/**
 * Main execution function to initialize and start scraping.
 */
const go = async () => {
  const proxySession = newProxy();
  console.log(`[INFO] Starting scraper with proxy: ${proxySession}`);
  await scrapper(proxySession);
};

// Execute the script
go().catch((error) => {
  console.error("[FATAL] Unhandled error in the scraping process:", error);
});
