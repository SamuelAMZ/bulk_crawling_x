// country groups get from json files
const fs = require("fs");
const countriesLinks = require("../entry");

const group1 = async () => {
  let arr = [];

  for (let i = 0; i < 1341; i++) {
    const countryNameArr = countriesLinks[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 1];

    const output = await fs.promises.readFile(
      `./_rmaps/profiles/${countryName}.json`,
      "utf8"
    );

    obj = JSON.parse(output);
    arr.push(...obj.data);
    console.log(countryName, i);
  }

  return arr;
};

const group2 = async () => {
  let arr = [];

  for (let i = 1341; i < 2682; i++) {
    const countryNameArr = countriesLinks[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 1];

    const output = await fs.promises.readFile(
      `./_rmaps/profiles/${countryName}.json`,
      "utf8"
    );

    obj = JSON.parse(output);
    arr.push(...obj.data);
  }

  return arr;
};

module.exports = {
  group1,
  group2,
};
