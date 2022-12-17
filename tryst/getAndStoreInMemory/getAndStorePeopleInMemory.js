// get and store people link in single page in memory array
// will return aarray of url of the current page people

const getAndStorePeopleInMemory = async (page) => {
  const people = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        "#main-content > div.bg-thumbs.w-100.pt-4 > div > div"
      )[0].children
    ).map((item) => item.querySelector("a").href)
  );

  console.log(people);
  return people;
};

module.exports = getAndStorePeopleInMemory;
