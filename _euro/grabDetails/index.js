// grab ladies details and return data array

const { getCountryCodes } = require("../utils/getCountryCodes");

/**
 *
 * @param {object} page
 * @param {Array} actualLink
 * @returns
 */
const grabDetails = async (page, actualLink) => {
  // all single info
  const data = [];
  const countryCodes = getCountryCodes();

  // name
  let name = "";
  try {
    const statusSelector = await page.waitForSelector(".description h1", {
      timeout: 5000,
    });
    nameBrute = await statusSelector?.evaluate((el) => el?.innerText);
    name = nameBrute?.split(",")[0]?.toLowerCase()?.replace(".", "")?.trim();
  } catch (error) {
    console.log(error?.message || error);
  }

  // gender
  let gender = "";
  try {
    const genderSelector = await page.waitForSelector(
      "#main-content > div > div.params > div:nth-child(1)",
      {
        timeout: 5000,
      }
    );
    gender = await genderSelector?.evaluate((el) =>
      el?.innerText?.replace("Gender:", "")
    );
    if (gender?.toLowerCase() === "female") {
      gender = "Woman";
    }
  } catch (error) {
    console.log(error?.message || error);
  }

  // country & city
  let locationArr = "";
  try {
    locationArr = await page.evaluate(() => {
      const elms = [];
      Array.from(
        Array.from(document.querySelectorAll(".contacts"))[0]?.children
      ).forEach((item) => {
        if (
          item?.tagName === "DIV" &&
          item?.className !== "buttons" &&
          item?.getAttribute("id") !== "js-phone"
        ) {
          elms.push({
            [item.children[0].innerText.trim()]:
              item.children[1].innerText.trim(),
          });
        }
      });
      return elms;
    });
  } catch (error) {
    console.log(error?.message || error);
  }

  //   // country
  let country = "";
  let city = "";
  let website = "";
  let email = "";
  try {
    locationArr?.forEach((elm) => {
      if (elm) {
        for (const i in elm) {
          if (i.replace(":", "").toLowerCase() === "country") {
            country = elm[i];
          }
          if (i.replace(":", "").toLowerCase() === "city") {
            city = elm[i];
          }
          if (i.replace(":", "").toLowerCase() === "website") {
            website = elm[i];
          }
        }
      }
    });
  } catch (error) {
    console.log(error?.message || error);
  }

  //   sms
  let sms = "";
  try {
    // click on the sms btn
    await page.waitForSelector(".js-phone.js-stt-click", {
      timeout: 5000,
    });

    const button = await page.$(".js-phone.js-stt-click");
    await button?.evaluate((b) => b?.click());

    //   grab sms
    let smsSelector = await page.waitForSelector(".js-phone.js-stt-click", {
      timeout: 5000,
    });

    smsBrute = await smsSelector?.evaluate((el) => el?.innerText);
    sms = smsBrute?.replaceAll("&nbsp;", "")?.replaceAll(" ", "")?.trim();
  } catch (error) {
    console.log(error?.message || error);
  }

  let twitter = "";
  let instagram = "";
  let onlyfans = "";

  //  profile images
  let profileImages = "";
  try {
    profileImages = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".thumbs")[0]?.children)?.map(
        (item) => {
          return item?.querySelector("a")?.href;
        }
      )
    );
  } catch (error) {
    console.log(error?.message || error);
  }

  // status
  let status = "";
  try {
    const statusSelector = await page.waitForSelector(".description h1", {
      timeout: 5000,
    });
    statusBrute = await statusSelector?.evaluate((el) => el?.innerText);
    let firstCheck = statusBrute
      ?.split(",")[1]
      ?.toLowerCase()
      ?.replace(".", "")
      ?.trim();
    if (firstCheck?.includes("agency")) {
      status = "agency";
    } else {
      status = "independent";
    }
  } catch (error) {
    console.log(error?.message || error);
  }

  //   profile link
  const profileLink = actualLink;

  //   // ---------- pushing all info
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
    ownerSite: "euro",
    status: status,
    profileLink,
    needUpdate: sms === "hided" || email === "hided" ? true : false,
  });

  return data;
};

module.exports = grabDetails;
