const getPagination = async (page) => {
  try {
    try {
      await page.waitForSelector(".cPagination", {
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
      const pagination = await page.evaluate(() => {
        const totalPages = Number(
          Array.from(document.querySelector(".cPagination")?.children)?.at(-1)
            .innerText
        );

        const currentPage = Number(
          document.querySelector(".cPagination a.active")?.innerText
        );

        console.log(`[INFO] pagination: ${currentPage} -->${totalPages}`);
        return { totalPages, currentPage };
      });
      return pagination;
    } catch (error) {
      console.log(error?.message || error);
    }
  } catch (error) {
    console.log("[ERROR] Error fetching page pagination", error.message);
  }
};

module.exports = { getPagination };
