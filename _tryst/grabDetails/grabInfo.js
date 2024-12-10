const { getCountryCodes } = require("../utils/getCountryCodes");

const grabInfo = async (page, profileLink) => {
  // all single info
  const data = [];
  const countryCodes = getCountryCodes();

  // name
  let name = "";
  try {
    const nameSelector = await page.waitForSelector("#profile-name", {
      timeout: 500,
    });
    name = await nameSelector.evaluate((el) => el?.textContent);
  } catch (error) {
    console.log(error?.message || error);
  }

  // gender
  let gender = "";

  try {
    const genderSelector = await page.waitForSelector(
      "#main-content > div:nth-child(4) > div.row.position-relative > div > div > span:last-child",
      {
        timeout: 500,
      }
    );
    gender = await genderSelector.evaluate((el) => el?.textContent);
    gender = gender.replace("\n", "");
  } catch (error) {
    console.log(error?.message || error);
  }

  // country
  let country = "";
  let city = "";
  try {
    const countrySelector = await page.waitForSelector(
      "#main-content > div:nth-child(4) > div.row.position-relative > div > div a",
      {
        timeout: 500,
      }
    );
    let countryCodeElm = await countrySelector.evaluate(
      (el) => el?.textContent
    );
    let countryCodeArr = countryCodeElm.split(",");
    let countryCode = countryCodeArr?.at(-1)?.trim();
    country = "";
    countryCodes.forEach((elm) => {
      if (elm?.code === countryCode) {
        return (country = elm?.name);
      }
    });

    //   city
    city = countryCodeArr?.at(0).replace("\n", "");
  } catch (error) {
    console.log(error?.message || error);
  }

  //   contact info
  let contactDataArr = "";
  try {
    contactDataArr = await page.evaluate(() =>
      Array.from(
        Array.from(document.querySelectorAll("#main-content ul"))[0]?.children
      ).map((item) => ({
        [item.children[0].innerText.trim()]:
          item?.children[1]?.innerText?.trim(),
      }))
    );
  } catch (error) {
    console.log(error?.message || error);
  }

  let website = "";
  let email = "";
  let sms = "";
  let twitter = "";
  let instagram = "";
  let onlyfans = "";

  contactDataArr.forEach((elm) => {
    if (elm) {
      for (const i in elm) {
        if (i.toLowerCase() === "website") {
          website = elm[i];
        }
        if (i.toLowerCase() === "email") {
          if (elm[i].includes("Show")) {
            email = "hided";
          } else {
            email = elm[i];
          }
        }
        if (i.toLowerCase() === "mobile") {
          if (elm[i].includes("Show")) {
            sms = "hided";
          } else {
            sms = elm[i].trim().replace(" ", "").replaceAll("-", "");
          }
        }
        if (i.toLowerCase() === "twitter") {
          twitter = elm[i];
        }
        if (i.toLowerCase() === "instagram") {
          instagram = elm[i];
        }
        if (i.toLowerCase() === "onlyfans") {
          onlyfans = elm[i];
        }
      }
    }
  });

  //   profile images
  let profileImages = "";
  try {
    profileImages = await page.evaluate(() =>
      Array.from(
        Array.from(
          document.querySelectorAll(
            "#main-content > div.bg-primary.position-relative > div.slideshow-height.scroll-bar-horizontal"
          )
        )[0]?.children
      )?.map((item) => item?.href)
    );
  } catch (error) {
    console.log(error?.message || error);
  }

  // ---------- pushing all info
  data.push({
    name,
    gender,
    country,
    city,
    website,
    sms,
    email,
    twitter,
    onlyfans,
    instagram,
    hasWebsite: website !== "" ? true : false,
    hasSms: sms !== "" ? true : false,
    hasEmail: email !== "" ? true : false,
    images: profileImages,
    ownerSite: "tryst",
    status: "independant",
    profileLink,
    needUpdate: sms === "hided" || email === "hided" ? true : false,
  });

  if (data[0].sms === "hided" || data[0].email === "hided") {
    return "bloked";
  }

  return data;
};

module.exports = grabInfo;
