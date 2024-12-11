const addNewIndependant = require("../../db/addNewIndependant");
const checkIndependant = require("../../db/checkIndependant");
const grabDetails = require("../grabDetails/index");

const visitProfiles = async (page, link) => {
  try {
    // wait 1sec for the array to be ready
    console.log("[Visit profiles]");

    // check if it needs to be added or not
    console.log(`[INFO] Check data in DB for ${link}`);
    const isNeeded = await checkIndependant(link);

    if (isNeeded) {
      console.log("[INFO] already in db");
      return;
    }

    // visite profile
    try {
      await page.goto(link, {
        waitUntil: "networkidle2",
        timeout: 120000,
      });
    } catch (error) {
      console.log(`[ERROR] -- navigation error ${error.messgae}`);
      return;
    }

    // grab details
    await page.waitForTimeout(1000);
    const data = await grabDetails(page, link);

    // add to db
    await addNewIndependant(data[0]);
  } catch (error) {
    console.log(`[ERROR] -- ${error.message}`);
  }
};

module.exports = visitProfiles;
