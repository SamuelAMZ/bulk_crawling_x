const addNewIndependant = require("../../db/addNewIndependant");
const checkIndependant = require("../../db/checkIndependant");
const grabDetails = require("../grabDetails/index");

const visitProfiles = async (page, link) => {
  try {
    // verify if link is not already in db
    try {
      // check if it needs to be added or not
      console.log("[INFO] Check data in DB");
      const isNeeded = await checkIndependant(link);
      if (isNeeded) {
        console.log("[INFO] already in db");
        return;
      }
    } catch (error) {
      console.log(error?.message || error);
    }

    // go to link

    await page.goto(link, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    console.log(`[INFO] scraping ${link}`);

    // grab details
    await page.waitForTimeout(1000);
    try {
      const data = await grabDetails(page, link);
      // add to db
      await addNewIndependant(data[0]);
    } catch (error) {
      console.log(error?.message || error);
    }
  } catch (error) {
    console.log(`[INFO] -- ${error.message}`);
  }
};

module.exports = visitProfiles;
