const addNewIndependant = require("../../db/addNewIndependant");
const checkIndependant = require("../../db/checkIndependant");
const grabDetails = require("../grabDetails/index");

const visitProfiles = async (page, people) => {
  // wait 1sec for the array to be ready
  console.log("here");

  // loop to visit one
  for (let i = 0; i < people.length; i++) {
    console.log("now", i);
    // verify if link is not already in db
    const isNeeded = await checkIndependant(people[i]);
    if (isNeeded) {
      console.log("already");
      continue;
    }

    // visite profile
    try {
      await page.goto(people[i], {
        waitUntil: "networkidle2",
        timeout: 120000,
      });
    } catch (error) {
      console.log(error, "navigation error");
      continue;
    }

    // grab details
    await page.waitForTimeout(1000);
    const data = await grabDetails(page, people[i]);

    // add to db
    await addNewIndependant(data[0]);
  }
};

module.exports = visitProfiles;
