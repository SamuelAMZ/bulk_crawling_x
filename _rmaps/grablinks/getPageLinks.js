// get individual page links and create json file of it
const fs = require("fs");

const individualPageLinks = async (page, link) => {
  const linksArr = [];
  // go to link
  await page.goto(link, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // check for cloudflare
  const PAGE_HEADER_CLASS = "#head-logo";
  await page.waitForSelector(PAGE_HEADER_CLASS, {
    timeout: 240000,
  });

  // wait 1sec
  await page.waitForTimeout(1000);

  // paginate if exist (give links to linksArr before each paginate)
  // detect pagination
  let isPagination = false;
  try {
    await page.waitForSelector(".blue-stripe .pagination", {
      timeout: 1000,
    });
    isPagination = true;
  } catch (error) {
    isPagination = false;
  }

  // detect how many pages paginate get
  let numberOfPage = 1;

  if (isPagination) {
    try {
      let totalPages = await page.evaluate(() => {
        let arrText = document
          .querySelector("#container > h1")
          .innerText.split("-");
        return Number(arrText[arrText.length - 1].trim());
      });

      let ITEM_PER_PAGE = 15;
      numberOfPage = Math.ceil(totalPages / ITEM_PER_PAGE);
      console.log(numberOfPage);
    } catch (error) {
      console.log(error);
    }
  }

  // loop to get links from all pagination pages
  for (let go = 0; go < numberOfPage; go++) {
    // grab links
    let singlePage = "";
    try {
      singlePage = await page.evaluate(() => {
        const arr = [];
        Array.from(document.querySelectorAll("#container > .rows")).forEach(
          (elm) => {
            Array.from(elm.children).forEach((c) => {
              if (c.querySelector("a")) {
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
    await page.goto(`${link}-${go + 2}`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // wait 2sec
    await page.waitForTimeout(1000);
  }

  console.log(linksArr, linksArr.length);

  // generate json file from linksArr
  let json = JSON.stringify({ data: linksArr });
  const countryNameArr = link.split("/");
  const countryName = countryNameArr[countryNameArr.length - 1].replace(
    "#rubmaps",
    ""
  );
  const callback = () => {
    console.log(countryName + " done!");
  };
  fs.writeFile(`${countryName}.json`, json, "utf8", callback);

  // next country
};

module.exports = individualPageLinks;
