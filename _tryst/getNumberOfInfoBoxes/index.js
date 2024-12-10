// return the number and children of info boxe

const numberOfBoxes = async (page) => {
  // get the number
  try {
    console.log("[INFO] Getting available information");
    await page.waitForSelector("#main-content ul", {
      timeout: 2000,
    });

    const elements = await page.evaluate(() =>
      Array.from(document.querySelector("#main-content ul")?.children)
    );

    return { number: elements?.length, boxesClass: "#main-content ul" };
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.log("[INFO] No numberOfBoxes found within the timeout.");
    } else {
      console.error(
        "[ERROR] An error occurred while handling numberOfBoxes:",
        error.message
      );
    }
  }
};

module.exports = numberOfBoxes;
