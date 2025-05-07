// get individual page links and create json file of it
const fs = require("fs");
const { getPagination } = require("../utils/getPagination.js");

function updatePaginatorPage(url, selector, pageNumber) {
  const urlObj = new URL(url);
  urlObj.searchParams.set(selector, pageNumber);
  return urlObj.toString();
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
          Array.from(
            document.querySelectorAll("#main-content .list-content .list-items")
          )?.forEach((elm) => {
            Array.from(elm?.children).forEach((c) => {
              arr.push(c?.querySelector("a")?.href);
            });
          });
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
        const nextPageLink = updatePaginatorPage(
          link,
          "profile-paginator-page",
          go + 1
        );

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

    try {
      const countryName = link.includes("?profile-paginator-page")
        ? link.split("/")?.at(-2)
        : link.split("/")?.at(-1);
      console.log(
        `[INFO] -- ${linksArr.length} profile links scraped for ${countryName}`
      );

      // generate json file from linksArr
      let json = JSON.stringify({ data: linksArr });
      const fileName = `${countryName}.json`;
      const filePath = `./_euro/profiles/${fileName}`;

      const callback = () => {
        console.log(
          `[INFO] Saving ${linksArr.length} for ${countryName} done!`
        );
      };
      fs.writeFile(`${filePath}`, json, "utf8", callback);
    } catch (error) {
      console.log(`[ERROR] failed  when  saving into file`);
    }

    return linksArr;
  } catch (error) {
    console.log(`[ERROR] --- ${error.message}`);
  }
};

module.exports = individualPageLinks;
