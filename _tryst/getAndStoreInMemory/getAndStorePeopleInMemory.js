// get and store people link in single page in memory array
// will return aarray of url of the current page people

/**
 *
 * @param {object} page - Puppeteer page instance.
 * @returns {Array} -  Return an array of links
 */
const getAndStorePeopleInMemory = async (page) => {
  try {
    console.log("[INFO] Scraping links");
    const people = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#main-content > div.bg-thumbs.w-100.pt-4 > div > div"
        )[0]?.children
      )
        .map((item) => item.querySelector("a").href)
        .filter((href) => href)
    );

    console.log(`[INFO] Scraping links count: ${people.length}`);
    return people;
  } catch (error) {
    console.log("[ERROR] failed to scrap links");
    return [];
  }
};

module.exports = getAndStorePeopleInMemory;
