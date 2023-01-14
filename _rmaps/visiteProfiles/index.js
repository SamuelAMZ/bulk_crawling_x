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

const visitProfiles = async (page) => {
  // wait 1sec for the array to be ready
  console.log("here");

  const tempAll = await group2();

  // loop to visit one
  for (let i = 0; i < tempAll.length; i++) {
    console.log("now");
    // verify if link is not already in db
    try {
      const isNeeded = await checkIndependant(tempAll[i]);
      if (isNeeded) {
        console.log("already");
        continue;
      }
    } catch (error) {
      console.log(error);
    }

    // visite profile
    try {
      await page.goto(tempAll[i], {
        waitUntil: "networkidle2",
        timeout: 120000,
      });
    } catch (error) {
      console.log(error, "navigation error");
      continue;
    }

    try {
      // check for cloudflare
      const PAGE_HEADER_CLASS = "#head-logo";
      await page.waitForSelector(PAGE_HEADER_CLASS, {
        timeout: 240000,
      });
    } catch (error) {
      console.log(error, "cloudflare error, on single profiles visit");
      continue;
    }

    // check if site block access
    try {
      // check for cloudflare
      const SITE_BLOCK_CLASS = "#maxreached";
      await page.waitForSelector(SITE_BLOCK_CLASS, {
        timeout: 1500,
      });
      console.log("site block");
      return "hide";
    } catch (error) {
      console.log("no block");
    }

    // grab details
    await page.waitForTimeout(1000);
    try {
      const data = await grabDetails(page, tempAll[i]);
      // add to db
      await addNewIndependant(data[0]);
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = visitProfiles;
