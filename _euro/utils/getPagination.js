const getPagination = async (page) => {
  const selector = ".pagination.js-nextprev-pagination";
  try {
    await page.waitForSelector(selector, {
      timeout: 5000,
      visible: true,
    });
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.log("[INFO] No pagination detected within the timeout.");
      return { totalPages: 1, currentPage: 1 };
    } else {
      console.error(
        "[ERROR] An error occurred while handling pagination:",
        error.message
      );
      return { totalPages: 1, currentPage: 1 };
    }
  }

  try {
    const pagination = await page.evaluate((selector) => {
      const totalPages = Number(
        Array.from(document.querySelectorAll(`${selector} li:not(.next)`))?.at(
          -1
        )?.innerText
      );

      const currentPage = Number(
        document.querySelector(`${selector} li.active`)?.innerText
      );

      console.log(`[INFO] pagination: ${currentPage} --> ${totalPages}`);
      return { totalPages, currentPage };
    }, selector);
    return pagination;
  } catch (error) {
    console.log(
      "[ERROR] Error while evaluating pagination:",
      error?.message || error
    );
    return { totalPages: 1, currentPage: 1 };
  }
};

module.exports = { getPagination };
