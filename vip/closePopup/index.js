// detect the first popup and close it

const firstLoadPopupResolver = async (page) => {
  await page.waitForSelector("#over-18-overlay .modal-content", {
    timeout: 10000,
  });

  const button = await page.$("#over-18");
  await button.evaluate((b) => b.click());
  console.log("popup closed");
};

module.exports = firstLoadPopupResolver;
