// grab all links from site and stor then as json in profile folder
const individualPageLinks = require("./getPageLinks");
const { getLocations } = require("../countriesGroups/getLocations");
const visiteProfiles = require("../visiteProfiles/index");

const grabLinks = async (page) => {
  try {
    const locations = await getLocations(page);

    for (let link of locations) {
      const href = `${link}?profile-paginator-page=1`;
      console.log(`[INFO] Visiting page: ${href}`);

      const linkArr = await individualPageLinks(page, href);

      for (let href of linkArr) {
        await visiteProfiles(page, href);
      }
    }
  } catch (error) {
    console.log(`[INFO] -- ${error.message}`);
  }
};

module.exports = grabLinks;
