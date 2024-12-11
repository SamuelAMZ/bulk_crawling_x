/**
 * Extracts all links from the page and paginates through the list if pagination exists.
 * @param {object} page - Puppeteer page instance.
 * @returns {string[]} - Array of links collected from the page.
 */
const pageLinks = async (page) => {
  const linksArray = [];
  let pagination = 1;

  try {
    console.log("[INFO] Checking for pagination...");
    const paginationSelector = await page.waitForSelector("nav ul.pagination", {
      timeout: 2000,
    });
    if (paginationSelector) {
      pagination = await paginationSelector.evaluate(
        (el) => el.children.length - 2
      );
      console.log(`[INFO] Found pagination with ${pagination} pages.`);
    } else {
      console.log("[INFO] No pagination found. Defaulting to 1 page.");
    }
  } catch (error) {
    console.warn("[WARN] Pagination selector not found. Defaulting to 1 page.");
  }

  // Loop through each pagination page or just once if no pagination
  for (let pagin = 0; pagin < pagination; pagin++) {
    try {
      console.log(`[INFO] Extracting links from page ${pagin + 1}...`);
      const links = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(".grid.fourPerRow.mobile.switchable")[0]
            ?.children || []
        )
          .map((item) => item.querySelector("a")?.href)
          .filter(Boolean)
      );

      linksArray.push(...links);
      console.log(
        `[INFO] Collected ${links.length} links from page ${pagin + 1}.`
      );

      // Click "Next" if there are more pages
      if (pagination > 1 && pagin < pagination - 1) {
        const nextButton = await page.$(
          "#listing > div.paging > nav > ul > li:last-child a"
        );
        if (nextButton) {
          await nextButton.evaluate((btn) => btn.click());
          console.log("[INFO] Navigating to next page...");
          await page.waitForTimeout(5000);
        } else {
          console.warn("[WARN] Next button not found on page.");
          break;
        }
      }
    } catch (error) {
      console.error(
        `[ERROR] Failed to process page ${pagin + 1}: ${error.message}`
      );
      break;
    }
  }

  console.log(`[INFO] Total links collected: ${linksArray.length}`);
  return linksArray;
};

module.exports = pageLinks;
