// get individual page links and create json file of it
const fs = require("fs");

const individualPageLinks = async (page, link) => {
  try {
    let linksArr = [];
    // go to link
    await page.goto(link, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    console.log("[INFO] current URL", link);

    try {
      console.log("[INFO] Scraping links");
      const people = await page.evaluate(() =>
        Array.from(document.querySelectorAll("#favesapp")[0]?.children)?.map(
          (item) => item?.querySelector("a")?.href
        )
      );
      console.log(`[INFO] Scraping links count: ${people?.length}`);
      linksArr = people;
    } catch (error) {
      console.log("[ERROR] failed to scrap links");
    }

    try {
      const countryName = link.split("/")?.at(-2);
      console.log(
        `[INFO] -- ${linksArr.length} profile links scraped for ${countryName}`
      );
      // generate json file from linksArr
      let json = JSON.stringify({ data: linksArr });
      const fileName = `${countryName}.json`;
      const filePath = `./_spal/profiles/${fileName}`;

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
