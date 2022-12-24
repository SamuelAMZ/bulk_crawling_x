// detect the first popup and close it

const firstLoadPopupResolver = async (page) => {
  await page.waitForSelector("[data-action*='click->terms-toast#agree']", {
    timeout: 3000,
  });

  const button = await page.$("[data-action*='click->terms-toast#agree']");
  await button.evaluate((b) => b.click());
  console.log("popup closed");
};

module.exports = firstLoadPopupResolver;
