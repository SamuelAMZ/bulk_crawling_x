// next page

const nextPage = async (page) => {
  let nextUrl;
  try {
    const urlSelector = await page.waitForSelector(".next-provider-button", {
      timeout: 60000,
    });
    nextUrl = await urlSelector.evaluate((el) => el.href);
    // go to the next
    await page.goto(nextUrl, {
      waitUntil: "networkidle2",
    });
  } catch (error) {
    console.log(error);
  }
  console.log("next");
};

module.exports = nextPage;
