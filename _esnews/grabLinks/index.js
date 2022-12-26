// grab all links from site and stor then as json in profile folder
const countriesLinks = require("../entry");
const individualPageLinks = require("./getPageLinks");

const grabLinks = async (page) => {
  console.log("paged");

  // links loop
  for (let i = 30; i < countriesLinks.length; i++) {
    await individualPageLinks(page, countriesLinks[i]);
  }

  await page.waitForTimeout(5000);
};

module.exports = grabLinks;
