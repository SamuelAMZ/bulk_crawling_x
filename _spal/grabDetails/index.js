// grab ladies details and return data array

const grabDetails = async (page, actualLink) => {
  try {
    // all single info
    const data = [];

    // name
    let nameArr = actualLink?.split("/");
    let name = nameArr?.at(-1)?.replace("-", " ");

    // gender
    let gender = "";

    // country
    let country = "Canada";

    //   city
    let city = "";

    try {
      await page.waitForSelector(
        "#body > div > div.page-title > div > h1 > a",
        {
          timeout: 5000,
        }
      );
    } catch (error) {}

    try {
      city = await page.evaluate(
        () =>
          document.querySelector("#body > div > div.page-title > div > h1 > a")
            ?.innerText
      );
    } catch (error) {
      console.log(error?.message || error);
    }

    try {
      await page.waitForSelector(".contact-details .action-area", {
        timeout: 5000,
      });
    } catch (error) {}
    let contactDataArr = "";
    try {
      contactDataArr = await page.evaluate(() => {
        const arr = [];
        Array.from(
          Array.from(
            document.querySelectorAll(".contact-details .action-area")
          )[0]?.children
        )?.forEach((item) => {
          if (item?.tagName !== "SPAN") {
            arr.push({
              [item.children[0].children[0].classList[1]]:
                item?.children[0]?.innerText?.trim(),
            });
          }
        });

        return arr;
      });
    } catch (error) {
      console.log(error?.message || error);
    }

    let website = "";
    let sms = "";
    let email = "";

    contactDataArr?.forEach((elm) => {
      if (elm) {
        for (const i in elm) {
          if (i.toLowerCase().includes("fa-globe")) {
            website = elm[i];
          }
          if (i.toLowerCase().includes("fa-envelope-o")) {
            email = elm[i];
          }
          if (i.toLowerCase().includes("fa-phone")) {
            sms = elm[i]?.replace(" ", "")?.replaceAll("-", "")?.trim();
          }
        }
      }
    });

    let twitter = "";
    let instagram = "";
    let onlyfans = "";

    // //  profile images
    let profileImages = "";
    try {
      profileImages = await page.evaluate(() =>
        Array.from(document.querySelectorAll(".gallery-img"))?.map((item) => {
          return `${item?.querySelector("a")?.href}`;
        })
      );
    } catch (error) {
      console.log(error?.message || error);
    }

    // status
    let status = "agency";

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
      ownerSite: "spapal",
      status: status,
      profileLink,
      needUpdate: sms === "hided" || email === "hided" ? true : false,
    });

    return data;
  } catch (error) {
    console.log(`[ERROR]-- ${error.message}`);
  }
};

module.exports = grabDetails;
