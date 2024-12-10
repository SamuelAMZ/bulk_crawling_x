// next page

/**
 *
 * @param {object} page - puppeteer instance
 */
const nextPage = async (page) => {
  try {
    const urlSelector = await page.waitForSelector(".next-provider-button", {
      timeout: 60000,
    });
    const nextUrl = await urlSelector?.evaluate((el) => el?.href);
    // go to the next
    await page.goto(nextUrl, {
      waitUntil: "networkidle2",
    });
    console.log(`[INFO] Navigate to the next page`);
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.log(
        "[INFO] No selector [.next-provider-button] found within the timeout."
      );
    } else {
      console.error(
        "[ERROR] An error occurred while trying to navigate to next page:",
        error.message
      );
    }
  }
};

module.exports = nextPage;
