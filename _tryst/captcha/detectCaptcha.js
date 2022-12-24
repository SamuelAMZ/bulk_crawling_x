// detect if captcha is  present or not
// @return bool

const isCaptcha = async (page) => {
  let detect = false;

  try {
    await page.waitForSelector(".fancybox__content", {
      timeout: 2000,
    });
    detect = true;
  } catch (error) {
    detect = false;
  }

  return detect;
};

module.exports = isCaptcha;
