// detect the first popup and close it

const firstLoadPopupResolver = async (page) => {
  try {
    await page.waitForSelector(".modal-content", {
      timeout: 10000,
    });

    // first btn
    const button1 = await page.$(".form-check-input");
    await button1.evaluate((b) => b.click());

    // second
    const button2 = await page.$(".btn.btn-warning.closeOverlay");
    await button2.evaluate((b) => b.click());

    console.log("popup closed");
  } catch (error) {
    console.log(error);
  }
};

module.exports = firstLoadPopupResolver;
