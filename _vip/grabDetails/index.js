const { getCountryCodes } = require("../utils/getCountryCodes");

const grabInfo = async (page) => {
  try {
    // all single info
    const data = [];
    const countryCodes = getCountryCodes();

    // name
    let name = "";
    try {
      const nameSelector = await page.waitForSelector(".teaser .row h1", {
        timeout: 500,
      });
      name = await nameSelector?.evaluate((el) => el?.innerText);
    } catch (error) {
      console.log(error?.message || error);
    }

    let details = "";
    // gender
    let gender = "";
    try {
      details = await page.evaluate(() =>
        Array.from(
          Array.from(document.querySelectorAll(".appearance-items"))[0]
            ?.children
        ).map((item) => item?.children[1]?.innerText.trim())
      );

      // grab gender
      details?.forEach((elm) => {
        if (elm?.trim()?.toLowerCase()?.includes("gender")) {
          gender = elm
            ?.replaceAll(" ", "")
            ?.replace("Gender:\n", "")
            ?.replace("gender:\n", "")
            ?.replace("gender", "")
            ?.replace("gender:", "")
            ?.replace(":", "")
            ?.trim()
            ?.toLowerCase();
        }
      });

      if (gender === "genderfemale") {
        gender = "Woman";
      }
    } catch (error) {
      console.log(error?.message || error);
    }

    // country
    let country = "Canada";

    // city
    let city = "";

    try {
      const citySelector = await page.waitForSelector(
        "[itemprop*='homeLocation']",
        {
          timeout: 500,
        }
      );
      city = await citySelector?.evaluate((el) => el?.parentElement?.innerText);
      city = city
        ?.trim()
        ?.replaceAll(" ", "")
        ?.replaceAll("\n", "")
        ?.replace("Location:", "")
        ?.replace(":", " ")
        ?.split(",")[0]
        ?.toLowerCase();

      if (city === "unknown") {
        city = "";
      }
    } catch (error) {
      console.log(error?.message || error);
    }

    // //   contact info
    let website = "";
    let email = "";
    let sms = "";

    try {
      let contact = await page.evaluate(() =>
        Array.from(
          Array.from(
            document.querySelectorAll(
              ".js-contacts-container.small-screen-pading-fix.contacts-container"
            )
          )[0].children
        )?.map((item) => item?.innerText.trim())
      );

      // grab contacts
      contact?.forEach((elm, idx) => {
        // sms
        if (idx === 0) {
          if (elm?.toLowerCase()?.includes("no")) {
            sms = "";
          } else {
            sms = elm
              ?.toLowerCase()
              ?.replace("(", "")
              ?.replace(")", "")
              ?.replaceAll(" ", "")
              ?.replaceAll("-", "")
              ?.trim();
          }
        }
        //   website
        if (idx === 1) {
          if (elm?.toLowerCase()?.includes("no")) {
            website = "";
          } else {
            website = elm?.toLowerCase()?.replaceAll(" ", "")?.trim();
          }
        }

        //   email
        if (idx === 2) {
          if (elm?.toLowerCase()?.includes("no")) {
            email = "";
          } else {
            email = elm?.toLowerCase()?.replaceAll(" ", "")?.trim();
          }
        }
      });
    } catch (error) {
      console.log(error?.message || error);
    }

    let twitter = "";
    let instagram = "";
    let onlyfans = "";

    try {
      let socials = await page.evaluate(() =>
        Array.from(
          Array.from(
            document.querySelectorAll("ul.list-inline.social-profile.pull-left")
          )[0].children
        )?.map((item) => item?.children[0]?.href?.trim())
      );

      // grab contacts
      socials?.forEach((elm) => {
        // twitter
        if (elm?.includes("twitter")) {
          twitter =
            "@" +
            elm
              ?.replace("https://twitter.com/", "")
              ?.replace("https", "")
              ?.replace("www", "")
              ?.replace(":", "")
              ?.replaceAll("/", "")
              ?.replace("twitter.com", "")
              ?.trim();
        }
        // instagram
        if (elm?.includes("instagram")) {
          instagram =
            "@" +
            elm
              ?.replace("https://www.instagram.com/", "")
              ?.replace("https", "")
              ?.replace("www", "")
              ?.replace(":", "")
              ?.replaceAll("/", "")
              ?.replace("instagram.com", "")
              ?.trim();
        }

        // onlyfans
        if (elm?.includes("onlyfans")) {
          onlyfans =
            "@" +
            elm
              ?.replace("https://www.onlyfans.com/", "")
              ?.replace("https", "")
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

    //  profile images
    let profileImages = "";
    try {
      profileImages = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(".gallery.pic.slick-slider")[0]?.children[1]
            ?.children[0]?.children
        ).map((item) => item?.querySelector("a")?.href)
      );
    } catch (error) {
      console.log(error?.message || error);
    }

    //   status
    let status = "";
    try {
      const statusSelector = await page.waitForSelector(
        ".teaser div.col-xs-12 h6.text-left.color-gray-label",
        {
          timeout: 500,
        }
      );
      status = await statusSelector.evaluate((el) => el?.innerText);
      status = status?.trim()?.replaceAll("\n", "")?.toLowerCase();
      if (status === "independent provider") {
        status = "independent";
      }
    } catch (error) {
      console.log(error?.message || error);
    }

    //   profile link
    const profileLink = await page.url();

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
      ownerSite: "vipfavour",
      status: status,
      profileLink,
      needUpdate: sms === "hided" || email === "hided" ? true : false,
    });

    return data;
  } catch (error) {
    console.log(`[ERROR] ${(error, message)}`);
  }
};

module.exports = grabInfo;
