// get individual page links and create json file of it
const fs = require("fs");
const { getPagination } = require("../utils/getPagination.js");

function updatePaginatorPage(url, currentPage) {
  // Regular expression to check if the URL already ends with `-<number>`
  const regex = /-\d+$/;

  // Check if the URL ends with `-<number>` and replace it with the new page number
  if (regex.test(url)) {
    return url.replace(regex, `-${currentPage}`);
  }

  // If no match is found, append the `-<currentPage>` to the URL
  return `${url}-${currentPage}`;
}

const individualPageLinks = async (page, link) => {
  try {
    const linksArr = [];
    // go to link
    await page.goto(link, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    console.log("[INFO] current URL", link);

    // detect hom many pages paginate get
    console.log("[INFO] Getting pagination");
    const { totalPages, currentPage } = await getPagination(page);

    // loop to get links from all pagination pages
    for (let go = currentPage; go <= totalPages; go++) {
      console.log("[INFO] Current index:", go);
      // grab links
      let currentPageUrls = [];
      try {
        currentPageUrls = await page.evaluate(() => {
          const arr = [];
          Array.from(document.querySelectorAll("#container > .rows")).forEach(
            (elm) => {
              Array.from(elm?.children).forEach((c) => {
                if (c?.querySelector("a")) {
                  arr?.push(c?.querySelector("a")?.href);
                }
              });
            }
          );
          return arr;
        });
      } catch (error) {
        console.log(error?.message || error);
      }

      console.log(
        `[INFO] Found ${currentPageUrls.length} links for  ${page.url()}`
      );
      // push to arr
      linksArr.push(...currentPageUrls);
      console.log(
        "[INFO] Pagination index:",
        go,
        "Found",
        currentPageUrls.length,
        "Total links:",
        linksArr.length
      );

      try {
        // next link
        const nextPageLink = updatePaginatorPage(link, go + 1);

        await page.goto(nextPageLink, {
          waitUntil: "networkidle2",
          timeout: 60000,
        });
      } catch (error) {
        console.log(
          `[ERROR] -- ${nextPageLink} navigation error: ${error.message}`
        );
      }

      try {
        // wait 2sec
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log("[ERROR] check for cloudflare", error.message);
      }
    }

    return linksArr;
  } catch (error) {
    console.log(`[ERROR] --- ${error.message}`);
  }
};

module.exports = individualPageLinks;
