// detect the first popup and close it

/**
 * Resolves a pop-up on the first load of the page.
 * @param {object} page - Puppeteer page instance.
 * @returns {boolean} - Returns true if a pop-up was found and handled, otherwise false.
 */
const firstLoadPopupResolver = async (page) => {
  try {
    console.log("[INFO] Checking for pop-up...");
    await page.waitForSelector("#over-18-overlay .modal-content", {
      timeout: 10000,
    });

    const button = await page.$("#over-18");

    if (button) {
      console.log("[INFO] Pop-up detected. Attempting to close...");
      await button.evaluate((b) => b.click());
      console.log("[INFO] Pop-up successfully closed.");
    } else {
      console.warn("[WARN] Button not found in the detected pop-up.");
    }
  } catch (error) {
    console.log(error.message);
    if (error.name === "TimeoutError") {
      console.log("[INFO] No pop-up detected within the timeout.");
    } else {
      console.error(
        "[ERROR] An error occurred while handling the pop-up:",
        error.message
      );
    }
  }
};

module.exports = firstLoadPopupResolver;
