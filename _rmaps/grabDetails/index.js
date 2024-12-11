// grab ladies details and return data array

const grabDetails = async (page, actualLink) => {
  // all single info
  const data = [];

  // name
  let name = "";
  try {
    const nameSelector = await page.waitForSelector(".titlu #qe_name", {
      timeout: 5000,
    });
    name = await nameSelector?.evaluate((el) => el?.innerText);
  } catch (error) {
    console.log(error?.message || error);
  }

  // gender
  let gender = "agency";

  // country
  let country = "United States";

  // //  city
  let city = "";

  try {
    const citySelector = await page.waitForSelector(".titlu", {
      timeout: 5000,
    });
    city = await citySelector.evaluate((el) =>
      el?.innerText?.split("in")[1]?.trim()?.split(",")[0]?.trim()
    );
  } catch (error) {
    console.log(error?.message || error);
  }

  // sms
  let sms = "";
  try {
    const smsSelector = await page.waitForSelector(
      "#qe_phone_number span.m_hide",
      {
        timeout: 5000,
      }
    );
    sms = await smsSelector.evaluate((el) =>
      el?.innerText?.replace(" ", "")?.replaceAll("-", "")?.trim()
    );
  } catch (error) {
    // console.log(error?.message || error);
  }

  // email
  let email = "";
  try {
    const emailSelector = await page.waitForSelector("#qe_email", {
      timeout: 5000,
    });
    email = await emailSelector?.evaluate((el) => el?.innerText);
  } catch (error) {
    // console.log(error?.message || error);
  }

  // website
  let website = "";
  try {
    const websiteSelector = await page.waitForSelector("#qe_website span", {
      timeout: 5000,
    });
    website = await websiteSelector?.evaluate((el) => el?.innerText);
  } catch (error) {
    // console.log(error?.message || error);
  }

  let twitter = "";
  let instagram = "";
  let onlyfans = "";

  // //  profile images
  let profileImages = [];
  try {
    const profileImagesSelector = await page.waitForSelector(
      "#photo_premium_click img",
      {
        timeout: 5000,
      }
    );
    profileImages = [await profileImagesSelector?.evaluate((el) => el.src)];
  } catch (error) {
    console.log(error?.message || error);
  }

  // status
  let status = "agency";

  // profile link
  const profileLink = actualLink;

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
    ownerSite: "rubmaps",
    status: status,
    profileLink,
    needUpdate: sms === "hided" || email === "hided" ? true : false,
  });

  return data;
};

module.exports = grabDetails;
