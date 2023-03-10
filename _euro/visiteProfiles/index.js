// split countries in 5 smaller groups
// node built in waiter
const { setTimeout } = require("timers/promises");
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

  const tempAll = await group5();

  // loop to visit one
  for (let i = 0; i < tempAll.length; i++) {
    console.log("now", i);
    // verify if link is not already in db
    const isNeeded = await checkIndependant(tempAll[i]);
    if (isNeeded) {
      console.log("already");
      continue;
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

    // grab details
    await page.waitForTimeout(1000);
    const data = await grabDetails(page, tempAll[i]);

    // add to db
    await addNewIndependant(data[0]);
  }
};

module.exports = visitProfiles;
