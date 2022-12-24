// grab page links and paginate throught the pagination if exist

const pageLinks = async (page) => {
  const linksArray = [];

  // grab pagination number or return 1 if not exist
  let pagination = 1;

  try {
    let paginationSelector = await page.waitForSelector("nav ul.pagination", {
      timeout: 2000,
    });
    pagination = await paginationSelector.evaluate(
      (el) => el.children.length - 2
    );
    console.log(await page.url(), " ", pagination);
  } catch (error) {
    pagination = 1;
    console.log(await page.url(), " ", pagination);
  }

  // loop depend on the number of paginate or run only 1 if paginate do not exist

  for (let pagin = 0; pagin < pagination; pagin++) {
    // grab first page
    let all = await page.evaluate(() =>
      Array.from(
        Array.from(
          document.querySelectorAll(".grid.fourPerRow.mobile.switchable")
        )[0].children
      ).map((item) => item.querySelector("a").href)
    );

    // push into array
    linksArray.push(...all);

    // click next if possible
    if (pagination > 1) {
      // next btn
      const next = await page.$(
        "#listing > div.paging > nav > ul > li:last-child a"
      );

      await next.evaluate((next) => {
        return next.click();
      });

      await page.waitForTimeout(5000);
    }
  }

  console.log(linksArray.length);

  return linksArray;
};

module.exports = pageLinks;
