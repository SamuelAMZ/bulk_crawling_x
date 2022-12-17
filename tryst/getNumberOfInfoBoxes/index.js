// return the number and chimdren of info boxe

const numberOfBoxes = async (page) => {
  // get the number
  try {
    await page.waitForSelector("#main-content ul", {
      timeout: 2000,
    });

    const elements = await page.evaluate(() =>
      Array.from(document.querySelector("#main-content ul").children)
    );

    console.log(elements);

    return { number: elements.length, boxesClass: "#main-content ul" };
  } catch (error) {
    console.log(error);
  }
};

module.exports = numberOfBoxes;
