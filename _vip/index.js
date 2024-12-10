const newProxy = require("../rotateProxy/rotateProxy");
const { setTimeout } = require("timers/promises");

// functions imports
const firstLoadPopupResolver = require("./closePopup/index");
const grabInfo = require("./grabDetails/index");
const nextPage = require("./next/index");
const checkIndependant = require("../db/checkIndependant");
const addNewIndependant = require("../db/addNewIndependant");

const { newBrowser } = require("./utils/newBrowser");
const { getConfigPuppeteer } = require("./utils/configPuppeteer");
const { newPage } = require("./utils/newPage");
const { connectedToDatabase } = require("./utils/connectedToDatabase");
require("dotenv").config();

// Initialize database connection
connectedToDatabase();

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
    const targetUrl = `${process.env.VIP_ENTRY}`;
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

    //   check if popup apears and close it
    console.log(`[INFO] Resolving pop-ups if present...`);
    await firstLoadPopupResolver(page);
    await page.waitForTimeout(500);
  } catch (error) {
    console.log(error.message, proxySession);
  }

  while (true) {
    // check if it needs to be added or not
    const currentPage = await page.url();
    console.log("[INFO] Check data in DB");
    const isNeeded = await checkIndependant(currentPage);

    if (isNeeded) {
      console.log("[INFO] already in db", currentPage);
      try {
        await nextPage(page);
      } catch (error) {
        console.error(`[ERROR] ${error.message}`);
        await browser.close();
        console.log("[INFO] Browser closed.");
      }
    }

    //grab details
    try {
      const data = await grabInfo(page);
      // add to db
      await addNewIndependant(data[0]);
    } catch (error) {
      console.log(error?.message || error);
    }

    //   next page
    try {
      await nextPage(page);
    } catch (error) {
      console.log(error?.message || error);
      console.error(`[ERROR] ${error.message}`);
      await browser.close();
      console.log("[INFO] Browser closed.");
    }
  }
};

// new ip
const go = async () => {
  const proxySession = newProxy();
  await scrapper(proxySession);
};

go();
