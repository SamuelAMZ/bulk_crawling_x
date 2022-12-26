// will wait until clouflare finish verify browser
// or close browser and reopened it with a new proxy
const newProxy = require("../../rotateProxy/rotateProxy");

const cloudflareBypass = async (page, browser) => {
  // wait for the page to appear or next loop
  let newCreatedPage;
  let newBrowser;
  for (let i = 0; i < 10; i++) {
    try {
      const PAGE_HEADER_CLASS = ".fullwrap.clear";
      await page.waitForSelector(PAGE_HEADER_CLASS, {
        timeout: 240000,
      });

      console.log("cloudflare done!");
      //   return new page and browser
      newCreatedPage = page;
      newBrowser = browser;

      // return new clouflaredLess page
      return { p: newCreatedPage, b: newBrowser, status: "ok" };
    } catch (error) {
      console.log(error);
      console.log("cloudflare fails");

      // close browser
      await browser.close();
      // reopen a new
      const proxySession = newProxy();
      newBrowser = await puppeteer.launch({
        headless: false,
        args: [`--proxy-server=${proxySession}`],
      });
      newCreatedPage = await newBrowser.newPage();
      continue;
    }
  }

  //   return false means fails after 10 attemps
  return { p: newCreatedPage, b: newBrowser, status: false };
};

module.exports = cloudflareBypass;
