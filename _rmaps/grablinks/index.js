// grab all links from site and stor then as json in profile folder
const {
  countriesLinks1,
  countriesLinks2,
  countriesLinks3,
  countriesLinks4,
  countriesLinks5,
} = require("../entry");
const individualPageLinks = require("./getPageLinks");

const grabLinks = async (page) => {
  console.log("paged");

  // links loop
  for (let i = 0; i < countriesLinks5.length; i++) {
    await individualPageLinks(page, String(countriesLinks5[i]));
  }

  await page.waitForTimeout(5000);
};

module.exports = grabLinks;
