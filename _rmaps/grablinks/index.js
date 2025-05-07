// grab all links from site and stor then as json in profile folder
const individualPageLinks = require("./getPageLinks");
const { getLocations } = require("../countriesGroups/getLocations");
const visitProfiles = require("../visitProfiles/index");
const firstLoadPopupResolver = require("../closePopup");

const grabLinks = async (page) => {
  try {
    //   close popup
    await firstLoadPopupResolver(page);
  } catch (error) {
    console.log("[ERROR] failed to close popup", error.message);
  }

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
