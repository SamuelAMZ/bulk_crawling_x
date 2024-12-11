// split countries in 5 smaller groups
// node built in waiter
const {
  group1,
  group2,
  group3,
  group4,
  group5,
} = require("../countriesGroups/index");
const addNewIndependant = require("../../db/addNewIndependant");
const checkIndependant = require("../../db/checkIndependant");
const grabDetails = require("../grabDetails/index");

/**
 *
 * @param {object} page - puppeteer instance
 * @returns
 */
const visitProfiles = async (page) => {
  // wait 1sec for the array to be ready
  console.log("here");

  const tempAll = await group5();

  // loop to visit one
  for (let i = 0; i < tempAll.length; i++) {
    try {
      // check if it needs to be added or not
      console.log("[INFO] Check data in DB");
      const isNeeded = await checkIndependant(tempAll[i]);
      if (isNeeded) {
        console.log("[INFO] already in db");
        continue;
      }
    } catch (error) {
      console.log(error?.message || error);
    }

    // visite profile
    try {
      await page.goto(tempAll[i], {
        waitUntil: "networkidle2",
        timeout: 120000,
      });
    } catch (error) {
      console.log(`[ERROR] -- navigation error ${error.messgae}`);
      continue;
    }

    console.log(tempAll[i] + " visited");

    try {
      // check for cloudflare
      const PAGE_HEADER_CLASS = "#head-logo";
      await page.waitForSelector(PAGE_HEADER_CLASS, {
        timeout: 240000,
      });
    } catch (error) {
      console.log(error.message, "[ERROR] Cloudflare error, on single profiles visit");
      continue;
    }

    // check if site block access
    try {
      // check for cloudflare
      const SITE_BLOCK_CLASS = "#maxreached";
      await page.waitForSelector(SITE_BLOCK_CLASS, {
        timeout: 1500,
      });
      console.log("[ERROR] Site is blocked");
      return "hide";
    } catch (error) {
      console.log("no block");
      console.log("[INFO] Site not blocked")
    }

    // grab details
    await page.waitForTimeout(1000);
    try {
      const data = await grabDetails(page, tempAll[i]);
      // add to db
      await addNewIndependant(data[0]);
    } catch (error) {
      console.log(error?.message || error);
    }
  }
};

module.exports = visitProfiles;
