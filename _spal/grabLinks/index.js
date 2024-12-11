// grab all links from site and stor then as json in profile folder
const individualPageLinks = require("./getPageLinks");
const { getLocations } = require("../countriesGroups/getLocations");
const visitProfiles = require("../visitProfiles/index");

const grabLinks = async (page) => {
  try {
    const locations = await getLocations(page);

    for (let link of locations) {
      console.log(`[INFO] Visiting page: ${link}`);

      const linkArr = await individualPageLinks(page, link);

      for (let href of linkArr) {
        await visitProfiles(page, href);
      }
    }
  } catch (error) {
    console.log(`[INFO] -- ${error.message}`);
  }
};

module.exports = grabLinks;
