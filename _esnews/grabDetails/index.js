// grab ladies details and return data array

const grabDetails = async (page, actualLink) => {
  // all single info
  const data = [];

  let name = "";
  try {
    const nameSelector = await page.waitForSelector(".modelNameInfo h1", {
      timeout: 5000,
    });
    name = await nameSelector?.evaluate((el) => el?.innerText);
  } catch (error) {
    console.log(error?.message || error);
  }

  // gender
  let gender = "";
  try {
    const genderSelector = await page.waitForSelector(
      ".modelInfo.clear > ul:nth-child(1) > li:nth-child(1)",
      {
        timeout: 5000,
      }
    );
    gender = await genderSelector.evaluate((el) =>
      el?.innerText?.replace("Gender:", "")
    );
    if (gender?.toLowerCase() === "female") {
      gender = "Woman";
    }
  } catch (error) {
    console.log(error?.message || error);
  }

  //   country & city
  let locationArr = "";
  try {
    locationArr = await page.evaluate(() => {
      const elms = [];
      Array.from(
        Array.from(document.querySelectorAll(".contactBlock .cContent"))[0]
          .children
      ).forEach((item) => {
        if (item.tagName === "DIV") {
          elms.push({
            [item.children[0].innerText.trim()]:
              item?.children[1]?.innerText?.trim(),
          });
        }
      });
      return elms;
    });
  } catch (error) {
    console.log(error?.message || error);
  }

  // country
  let country = "";
  let city = "";
  let sms = "";
  let website = "";
  let email = "";
  try {
    locationArr?.forEach((elm) => {
      if (elm) {
        for (const i in elm) {
          if (i.replace(":", "").toLowerCase().includes("country")) {
            country = elm[i];
          }
          if (i.replace(":", "").toLowerCase().includes("city")) {
            city = elm[i];
          }
          if (i.replace(":", "").toLowerCase().includes("phone")) {
            sms = elm[i].trim().replaceAll(" ", "").replaceAll("-", "");
          }
        }
      }
    });
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
      Array.from(document.querySelectorAll(".allthumbs")[0].children).map(
        (item) => {
          if (item?.classList?.contains("thumbPic")) {
            return item?.querySelector("a")?.href;
          }
        }
      )
    );
  } catch (error) {
    console.log(error?.message || error);
  }

  //   status
  let status = "";
  try {
    const statusSelector = await page.waitForSelector(
      ".mIndependent .mILeft h3",
      {
        timeout: 5000,
      }
    );
    statusBrute = await statusSelector.evaluate((el) => el?.innerText);
    status = statusBrute
      ?.split(",")[1]
      ?.toLowerCase()
      ?.replace("model", "")
      ?.replace(".", "")
      ?.trim();
  } catch (error) {
    console.log(error?.message || error);
  }

  // profile link
  const profileLink = actualLink;

  //  pushing all info
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
    ownerSite: "escortnews",
    status: status,
    profileLink,
    needUpdate: sms === "hided" || email === "hided" ? true : false,
  });

  return data;
};

module.exports = grabDetails;
