// get individual page links and create json file of it
const fs = require("fs");
const { getPagination } = require("../utils/getPagination");

const individualPageLinks = async (page, link) => {
  try {
    const linksArr = [];
    // go to link
    await page.goto(link, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    console.log("[INFO] current URL", link);

    try {
      // check for cloudflare
      const PAGE_HEADER_CLASS = ".fullwrap.clear";
      await page.waitForSelector(PAGE_HEADER_CLASS, {
        timeout: 240000,
      });
    } catch (error) {
      console.log("[ERROR] check for cloudflare", error.message);
    }

    // detect hom many pages paginate get
    console.log("[INFO] getting pagination");
    const { totalPages, currentPage } = await getPagination(page);

    // loop to get links from all pagination pages
    for (let go = currentPage; go <= totalPages; go++) {
      console.log("[INFO] pagination index:", go);
      // grab links
      let currentPageUrls = [];
      try {
        currentPageUrls = await page.evaluate(() => {
          const arr = [];
          Array.from(document.querySelectorAll(".escortModels.clear")).forEach(
            (elm) => {
              Array.from(elm.children).forEach((c) => {
                if (!c.classList.contains("escortAd")) {
                  arr.push(c?.querySelector("a")?.href);
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
        const nextPageLink = `${link}/Page${go + 1}.html`;
        await page.goto(`${nextPageLink}`, {
          waitUntil: "networkidle2",
          timeout: 60000,
        });
      } catch (error) {
        console.log(
          `[ERROR] -- ${nextPageLink} navigation error: ${error.message}`
        );
      }

      try {
        // check for cloudflare
        const PAGE_HEADER_CLASS = ".fullwrap.clear";
        await page.waitForSelector(PAGE_HEADER_CLASS, {
          timeout: 240000,
        });

        // wait 2sec
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log("[ERROR] check for cloudflare", error.message);
      }
    }

    try {
      const countryName = link.includes("Page")
        ? link.split("/")?.at(-2)
        : link.split("/")?.at(-1);
      console.log(
        `[INFO] -- ${linksArr.length} profile links scraped for ${countryName}`
      );

      // generate json file from linksArr
      let json = JSON.stringify({ data: linksArr });
      const fileName = `${countryName}.json`;
      const filePath = `./_esnews/profiles/${fileName}`;

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
