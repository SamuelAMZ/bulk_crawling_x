const getLocations = async (page) => {
  try {
    const locations = await page.evaluate(() => {
      const elmts = Array.from(
        document.querySelectorAll("#js-country-list-openable a")
      )
        .map((e) => e?.href)
        .filter((el) => el);
      return elmts;
    });

    console.log(`[INFO] locations ${locations.length} found`);
    return locations;
  } catch (error) {
    console.log("[ERROR] Error fetching locations", error.message);
  }
};

module.exports = { getLocations };
