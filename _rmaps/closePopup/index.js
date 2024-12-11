/**
 * Resolves a pop-up on the first load of the page.
 * @param {object} page - Puppeteer page instance.
 * @returns {boolean} - Returns true if a pop-up was found and handled, otherwise false.
 */
const firstLoadPopupResolver = async (page) => {
  console.log("[INFO] Checking for pop-up...");

  try {
    // Wait for the pop-up to appear
    const popupSelector = "#entersitenotice_buttons";
    await page.waitForSelector(popupSelector, { timeout: 10000 });
    console.log("[INFO] Pop-up detected. Attempting to close...");

    // Find and click the agree button
    const button = await page.$(".entersitenotice_enter.gaTrack");
    if (button) {
      await button.evaluate((btn) => btn.click());
      console.log("[INFO] Pop-up successfully closed.");
      return true; // Pop-up handled
    } else {
      console.warn("[WARN] Button not found in the detected pop-up.");
    }
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.log("[INFO] No pop-up detected within the timeout.");
    } else {
      console.error(
        "[ERROR] An error occurred while handling the pop-up:",
        error.message
      );
    }
  }

  return false;
};

module.exports = firstLoadPopupResolver;
