const puppeteer = require("puppeteer-extra");
// puppeteer extra libraries
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
// const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
const blockResourcesPlugin = require("puppeteer-extra-plugin-block-resources");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");

// initializations
puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(StealthPlugin());
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
puppeteer.use(
  blockResourcesPlugin({
    blockedTypes: new Set(["font", "image", "media", "stylesheet", "other"]),
  })
);

function getConfigPuppeteer() {
  return { puppeteer };
}

module.exports = { getConfigPuppeteer };
