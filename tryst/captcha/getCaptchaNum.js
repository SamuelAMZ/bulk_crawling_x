//   resolve
const getCaptchaNums = async (svg, page) => {
  //   remove all unnececery elements (all, only path and numbers)
  const cuttedSvg = svg
    .replace(
      '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0,0,150,50">',
      ""
    )
    .replace("</svg>", "");

  const dataArray = cuttedSvg.split("<path ");

  // remove smaller elements
  const newArr = [];
  const smaller = dataArray.forEach((elm, idx) => {
    if (elm.length > 100) {
      newArr.push({ idx, path: elm });
    }
  });

  // data template
  const template = {
    2: 265,
    3: 402,
    5: 270,
    a: 242,
    c: 260,
    d: 237,
    e: 259,
    h: 197,
    k: 171,
    m: 380,
    n: 230,
    r: 154,
    w: 209,
    x: 168,
    y: 133,
    z: 177,
  };

  // get newArr values
  const final = [];
  newArr.forEach((elm) => {
    //   console.log(elm);
    Object.entries(template).forEach(([key, value]) => {
      if (elm.path.split(" ").length === value) final.push(key);
    });
  });

  //execute brower code
  const getCaptchaCode = async () => {
    return await page.evaluate(
      ({ svg, final }) => {
        // create element
        let fake = document.createElement("div");
        fake.classList.add("doneSoon");
        // append svg to it
        fake.innerHTML = svg;
        // append to body
        document.querySelector("body").appendChild(fake);
        // get svg proprieties
        const paraentSvg = document.querySelector(".doneSoon");
        const svgBox = Array.from(paraentSvg.querySelectorAll("path"));
        // brute array
        let bruteArr = [];
        svgBox.forEach((path) => {
          if (path.getAttribute("fill") !== "none") {
            let pathBBox = path.getBBox();
            bruteArr.push(pathBBox.x);
          }
        });

        // give item their place
        let positions = [];
        for (let x = 0; x < bruteArr.length; x++) {
          let count = 0;

          for (let z = 0; z < bruteArr.length; z++) {
            if (bruteArr[x] > bruteArr[z]) {
              count++;
            }
          }
          positions.push(count);
        }

        // swipe place to the letters
        let finalClone = [];
        for (let x = 0; x < positions.length; x++) {
          finalClone[positions[x]] = final[x];
        }

        //   reset evrything
        fake.remove();
        // finalClone = [];
        final = [];
        positions = [];
        bruteArr = [];

        console.log(finalClone.join(""));
        return finalClone.join("");
      },
      { svg, final }
    );
  };

  const code = await getCaptchaCode();
  return code;
};

module.exports = getCaptchaNums;
