// visit each profile
const numberOfBoxes = require("../getNumberOfInfoBoxes/index");
const isCaptcha = require("../captcha/detectCaptcha");
const getCaptchaNums = require("../captcha/getCaptchaNum");
const grabInfo = require("../grabDetails/grabInfo");
const addNewIndependant = require("../../db/addNewIndependant");
const checkIndependant = require("../../db/checkIndependant");

const visitProfile = async (peopleLinks, page) => {
  for (let i = 0; i < peopleLinks.length; i++) {
    // check if it needs to be added or not
    const isNeeded = await checkIndependant(peopleLinks[i]);

    if (isNeeded) {
      console.log("already");
      continue;
    }

    await page.goto(peopleLinks[i], {
      waitUntil: "networkidle2",
      timeout: 120000,
    });
    console.log(peopleLinks[i] + " visited");

    // loop info boxes
    // hold boxes children and number
    const boxesDetails = await numberOfBoxes(page);

    // click on the protected boxes (email, phone, whatsapp)
    for (let y = 0; y < boxesDetails.number; y++) {
      await page.evaluate((y) => {
        let parent = Array.from(
          document.querySelector("#main-content ul").children
        )[y];

        let child = parent.children[0].innerText.trim().toUpperCase();

        if (child === "EMAIL" || child === "MOBILE") {
          // click
          parent.children[1].querySelector("a").click();
        }
      }, y);

      try {
        // detect captcha
        const captcha = await isCaptcha(page);

        // verify captcha
        if (captcha) {
          let xmlCode;
          // get xml
          page.on("response", async (response) => {
            const request = response.request();

            if (request.url().includes("svg+xml")) {
              xmlCode = await response.text();
            }
          });

          // getting iframe
          const elementHandle = await page.waitForSelector(
            ".fancybox__content iframe"
          );
          const frame = await elementHandle.contentFrame();
          await frame.waitForSelector("img");

          // console.log(xmlCode);
          let code = await getCaptchaNums(xmlCode, page);
          // console.log(code);

          // // type in captcha code
          await frame.waitForSelector("#captcha_text");
          await frame.type("#captcha_text", code, {
            delay: 10,
          });

          // submit captcha code
          await frame.waitForSelector("[name='commit']");
          await frame.click("[name='commit']");

          // wait for captcha to fully closed
          await page.waitForTimeout(2000);
        }
      } catch (error) {
        console.log(error);
        continue;
      }
    }

    // grab info
    await page.waitForTimeout(2000);
    const data = await grabInfo(page, peopleLinks[i]);
    // console.log(data);

    if (data === "bloked") {
      return "hide";
    }

    // add to db
    await addNewIndependant(data[0]);
  }
};

module.exports = visitProfile;
