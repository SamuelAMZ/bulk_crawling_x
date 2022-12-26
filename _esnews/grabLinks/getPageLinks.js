// get individual page links and create json file of it
const fs = require("fs");
const autoScroll = require("../../general/autoscroll");

const individualPageLinks = async (page, link) => {
  const linksArr = [];
  // go to link
  await page.goto(link, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // check for cloudflare
  const PAGE_HEADER_CLASS = ".fullwrap.clear";
  await page.waitForSelector(PAGE_HEADER_CLASS, {
    timeout: 240000,
  });

  // scroll to bottom
  await autoScroll(page);
  // wait 5sec
  await page.waitForTimeout(5000);

  // paginate if exist (give links to linksArr before each paginate)
  // detect pagination
  let isPagination = false;
  try {
    await page.waitForSelector(".cPagination", {
      timeout: 1000,
    });
    isPagination = true;
  } catch (error) {
    isPagination = false;
  }

  // detect hom many pages paginate get
  let numberOfPage = 1;

  if (isPagination) {
    try {
      numberOfPage = await page.evaluate(() =>
        Number(
          document.querySelector(".cPagination").children[
            document.querySelector(".cPagination").children.length - 1
          ].innerText
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  // loop to get links from all pagination pages
  for (let go = 0; go < numberOfPage; go++) {
    // scroll to bottom
    await autoScroll(page);
    // grab links
    let singlePage = "";
    try {
      singlePage = await page.evaluate(() => {
        const arr = [];
        Array.from(document.querySelectorAll(".escortModels.clear")).forEach(
          (elm) => {
            Array.from(elm.children).forEach((c) => {
              if (!c.classList.contains("escortAd")) {
                arr.push(c.querySelector("a").href);
              }
            });
          }
        );
        return arr;
      });
    } catch (error) {
      console.log(error);
    }
    // push to arr
    linksArr.push(...singlePage);
    console.log(linksArr.length);

    // next link
    await page.goto(`${link}/Page${go + 2}.html`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // check for cloudflare
    const PAGE_HEADER_CLASS = ".fullwrap.clear";
    await page.waitForSelector(PAGE_HEADER_CLASS, {
      timeout: 240000,
    });

    // wait 2sec
    await page.waitForTimeout(2000);
  }

  console.log(linksArr, linksArr.length);

  // generate json file from linksArr
  let json = JSON.stringify({ data: linksArr });
  const countryNameArr = link.split("/");
  const countryName = countryNameArr[countryNameArr.length - 1];
  const callback = () => {
    console.log(countryName + " done!");
  };
  fs.writeFile(`${countryName}.json`, json, "utf8", callback);

  // next country
};

module.exports = individualPageLinks;
