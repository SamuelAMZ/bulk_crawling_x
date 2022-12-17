// visit each profile
const numberOfBoxes = require("../getNumberOfInfoBoxes/index");
const isCaptcha = require("../captcha/detectCaptcha");
const resolveCaptcha = require("../captcha/resolveCaptcha");

const visitProfile = async (peopleLinks, page) => {
  for (let i = 0; i < peopleLinks.length; i++) {
    await page.goto(peopleLinks[i], {
      waitUntil: "networkidle2",
    });
    console.log(peopleLinks[i] + " visited");

    // loop info boxes
    // hold boxes children and number
    const boxesDetails = await numberOfBoxes(page);

    for (let y = 0; y < boxesDetails.number; y++) {
      // click on the protected boxes (email, phone, whatsapp)
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

      // detect captcha
      const captcha = await isCaptcha(page);
      console.log(captcha);

      // verify captcha
      if (captcha) {
        // special check for the first page
        if (i === 0) {
          page.on("response", async (response) => {
            const request = response.request();
            // console.log(request.url());

            if (request.url().includes("svg+xml")) {
              const text = await response.text();
              // console.log(text);
            }
          });
          await page.waitForTimeout(2000);
        }

        await resolveCaptcha(page, i);
      }
    }

    // grab info
    // add to db
  }
};

module.exports = visitProfile;
