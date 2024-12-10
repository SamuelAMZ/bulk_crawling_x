// this file will help with starting a new browser session
const Xvfb = require("xvfb");

const newBrowser = async (puppeteer) => {
  try {
    if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test") {
      // browser configuration
      const broswerView = {
        headless: false, //new, false
        executablePath: puppeteer.executablePath(),
        defaultViewport: null,
        args: [
          "--start-maximized",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--disable-infobars",
          "--window-position=0,0",
          "--ignore-certifcate-errors",
          "--ignore-certifcate-errors-spki-list",
          "--no-zygote",
          // // "--single-process",
          // "--disable-gpu",
          "--enable-features=NetworkService",
          // `--proxy-server=${proxySession}`,
          // "--proxy-bypass-list=*",
          "--user-data-dir=%userprofile%\\AppData\\Local\\Chrome\\User Data",
          "--profile-directory=Profile 2",
          // `--disable-extensions-except=${paths}`,
          // `--load-extension=${paths}`,
        ],
        ignoreDefaultArgs: ["--enable-automation"],
        ignoreHTTPSErrors: true,
      };

      const browser = await puppeteer.launch({ ...broswerView });
      return { browser };
    } else {
      //  start virtual screen
      const xvfb = new Xvfb({
        silent: true,
        xvfb_args: ["-screen", "0", "1280x720x24", "-ac"],
      });
      xvfb.start((err) => {
        if (err) console.error(err);
      });

      // browser configuration
      const broswerView = {
        headless: false, //new, false
        executablePath: puppeteer.executablePath(),
        defaultViewport: null,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--disable-infobars",
          "--window-position=0,0",
          "--ignore-certifcate-errors",
          "--ignore-certifcate-errors-spki-list",
          "--no-zygote",
          // // "--single-process",
          // "--disable-gpu",
          "--enable-features=NetworkService",
          // `--proxy-server=${proxySession}`,
          // "--proxy-bypass-list=*",
          "--user-data-dir=%userprofile%\\AppData\\Local\\Chrome\\User Data",
          "--profile-directory=Profile 2",
          // `--disable-extensions-except=${paths}`,
          // `--load-extension=${paths}`,
          "--display=" + xvfb._display,
        ],
        ignoreDefaultArgs: ["--enable-automation"],
        ignoreHTTPSErrors: true,
      };

      const browser = await puppeteer.launch({ ...broswerView });
      return { browser };
    }
  } catch (error) {
    console.error(error);
    return {};
  }
};

module.exports = { newBrowser };
