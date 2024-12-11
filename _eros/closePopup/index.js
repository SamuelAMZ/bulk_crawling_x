/**
 * Resolves the first popup by interacting with its elements.
 * @param {object} page - Puppeteer page instance.
 */
const firstLoadPopupResolver = async (page) => {
  try {
    console.log("[INFO] Waiting for popup to appear...");
    await page.waitForSelector(".modal-content", { timeout: 10000 });

    // Interact with the first button
    const button1 = await page.$(".form-check-input");
    if (button1) {
      await button1.evaluate((b) => b.click());
      console.log("[INFO] First popup button clicked.");
    } else {
      console.warn("[WARN] First popup button not found.");
    }

    // Interact with the second button
    const button2 = await page.$(".btn.btn-warning.closeOverlay");
    if (button2) {
      await button2.evaluate((b) => b.click());
      console.log("[INFO] Second popup button clicked.");
    } else {
      console.warn("[WARN] Second popup button not found.");
    }

    console.log("[INFO] Popup resolved successfully.");
  } catch (error) {
    console.error(`[ERROR] Failed to resolve popup: ${error.message}`);
  }
};

module.exports = firstLoadPopupResolver;
