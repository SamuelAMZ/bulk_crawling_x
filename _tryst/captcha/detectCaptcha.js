// detect if captcha is  present or not
// @return bool

const isCaptcha = async (page) => {
  let detect = false;
  console.log("[INFO] Check if captcha is present");

  try {
    await page.waitForSelector(".fancybox__content", {
      timeout: 2000,
    });
    detect = true;
    console.log("[INFO] Captcha found");
  } catch (error) {
    detect = false;
    if (error.name === "TimeoutError") {
      console.log("[INFO] No captcha detected within the timeout.");
    } else {
      console.error(
        "[ERROR] An error occurred while handling captcha:",
        error.message
      );
    }
  }

  return detect;
};

module.exports = isCaptcha;
