// grab details from each link

const { getCountryCodes } = require("../utils/getCountryCodes");

const grabDetails = async (page, link) => {
  // all single info
  const data = [];
  const countryCodes = getCountryCodes();

  // name
  let name = "";
  try {
    const nameSelector = await page.waitForSelector("h4.showname", {
      timeout: 5000,
    });
    name = await nameSelector.evaluate((el) => el?.innerText);
    name = name?.toLowerCase()?.replace("reviewed", "")?.replace("vip", "");
  } catch (error) {
    console.log(error?.message || error);
  }
  // gender
  let gender = "";
  try {
    const genderSelector = await page.waitForSelector(
      ".infoDetails div:nth-child(1) p:nth-child(2)",
      {
        timeout: 5000,
      }
    );
    gender = await genderSelector?.evaluate((el) => el?.innerText);
    gender = gender?.toLowerCase();
  } catch (error) {
    console.log(error?.message || error);
  }

  // country
  let country = "";
  try {
    const countrySelector = await page.waitForSelector(
      "div.container.profileHeading > div > div.col-sm-12.col-lg-7 > p",
      {
        timeout: 5000,
      }
    );
    country = await countrySelector?.evaluate((el) => el?.innerText);
    country = country?.split("in")[1]?.trim()?.toLowerCase();

    let canada = ["vancouver", "toronto", "montreal"];
    let uk = ["london"];

    canada.forEach((elm) => {
      if (country === elm) {
        country = "Canada";
      } else {
        country = "United States";
      }
    });
    uk.forEach((elm) => {
      if (country === elm) {
        country = "United Kingdom";
      } else {
        country = "United States";
      }
    });
  } catch (error) {
    console.log(error?.message || error);
  }

  // city
  let city = "";
  try {
    const citySelector = await page.waitForSelector(
      "div.container.profileHeading > div > div.col-sm-12.col-lg-7 > p",
      {
        timeout: 5000,
      }
    );
    city = await citySelector?.evaluate((el) => el.innerText);
    city = city?.split("in")[1]?.trim()?.toLowerCase();
  } catch (error) {
    console.log(error?.message || error);
  }

  // contact info
  let website = "";
  let email = "";
  let sms = "";

  // sms
  try {
    const smsSelector = await page.waitForSelector(".phone a", {
      timeout: 5000,
    });
    sms = await smsSelector?.evaluate((el) => el?.innerText);
    sms = sms
      ?.toLowerCase()
      ?.replace("(", "")
      ?.replace(")", "")
      ?.replaceAll(" ", "")
      ?.replaceAll("-", "")
      ?.trim();
  } catch (error) {
    console.log(error?.message || error);
  }

  try {
    // email
    const emailAndSms = await page.evaluate(() =>
      Array.from(
        Array.from(document.querySelectorAll(".info.contactDetails"))[0]
          .children
      ).map((item) => {
        if (item.className !== "info-title") {
          return item?.querySelector("a")?.innerText;
        }
      })
    );

    if (emailAndSms.length >= 1) {
      emailAndSms.forEach((elm) => {
        if (elm && elm?.includes("@")) {
          email = elm;
        }
      });
    }

    console.log(emailAndSms);
  } catch (error) {
    console.log(error?.message || error);
  }

  let twitter = "";
  let instagram = "";
  let onlyfans = "";

  try {
    let socials = await page.evaluate(() =>
      Array.from(
        Array.from(document.querySelectorAll("ul.socialList"))[0]?.children
      ).map((item) => item?.children[0]?.href.trim())
    );

    // grab contacts
    socials.forEach((elm) => {
      // twitter
      if (elm.includes("twitter")) {
        twitter =
          "@" +
          elm
            ?.replace("https://twitter.com/", "")
            ?.replace("https", "")
            ?.replace("www", "")
            ?.replace(":", "")
            ?.replace(".", "")
            ?.replaceAll("/", "")
            ?.replace("twitter.com", "")
            ?.trim();
      }
      // instagram
      if (elm.includes("instagram")) {
        instagram =
          "@" +
          elm
            ?.replace("https://www.instagram.com/", "")
            ?.replace("https", "")
            ?.replace(".", "")
            ?.replace("www", "")
            ?.replace(":", "")
            ?.replaceAll("/", "")
            ?.replace("instagram.com", "")
            ?.trim();
      }

      // onlyfans
      if (elm.includes("onlyfans")) {
        onlyfans =
          "@" +
          elm
            ?.replace("https://www.onlyfans.com/", "")
            ?.replace("https", "")
            ?.replace(".", "")
            ?.replace("www", "")
            ?.replace(":", "")
            ?.replaceAll("/", "")
            ?.replace("onlyfans.com", "")
            ?.trim();
      }
    });
  } catch (error) {
    console.log(error?.message || error);
  }

  //   profile images
  let profileImages = "";
  try {
    profileImages = await page.evaluate(() =>
      Array.from(
        Array.from(document.querySelectorAll(".slick-track"))[0]?.children
      ).map((item) => item?.querySelector("img")?.src)
    );
  } catch (error) {
    console.log(error?.message || error);
  }

  // status
  let status = "independent";

  //
  const profileLink = await page.url();

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
    ownerSite: "eros",
    status: status,
    profileLink,
    needUpdate: sms === "hided" || email === "hided" ? true : false,
  });

  console.log(data);

  return data;
};

module.exports = grabDetails;
