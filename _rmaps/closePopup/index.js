// detect the first popup and close it

const firstLoadPopupResolver = async (page) => {
  try {
    await page.waitForSelector("#entersitenotice_buttons", {
      timeout: 10000,
    });

    // first btn
    const button1 = await page.$(".entersitenotice_enter.gaTrack");
    await button1.evaluate((b) => b.click());

    console.log("popup closed");
  } catch (error) {
    console.log(error);
  }
};

module.exports = firstLoadPopupResolver;
