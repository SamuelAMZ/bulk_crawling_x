// dotenv
require("dotenv").config();

const { aNewUa } = require("./newUa.js");

const newPage = async (browser, userAgent = false) => {
  const page = await browser.newPage();

  // add user agent
  if (userAgent) {
    // get new ua
    const newUa = aNewUa();
    await page.setUserAgent(newUa);
    console.log("success setting user agent");
  }

  // rotate proxy user for greenhouse
  let userName = process.env.PROXY_USER;
  let password = process.env.PROXY_PASSWORD;

  try {
    // auth for proxy
    await page.authenticate({
      username: userName,
      password: password,
    });
    console.log("success auth proxy");
  } catch (error) {
    console.error(error.message, "proxy");
  }

  // timeout configuration
  await page.setDefaultNavigationTimeout(60 * 1000); // 1min
  await page.setDefaultTimeout(60 * 1000); // 1min

  return page;
};

module.exports = { newPage };
