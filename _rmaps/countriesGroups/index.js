// country groups get from json files
const fs = require("fs");
const { allCountries } = require("../entry");

const group1 = async () => {
  let arr = [];

  for (let i = 0; i < 536; i++) {
    const countryNameArr = allCountries[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 1];

    const output = await fs.promises.readFile(
      `./_rmaps/profiles/${countryName}.json`,
      "utf8"
    );

    obj = JSON.parse(output);
    arr.push(...obj.data);
    // console.log(countryName, i);
  }

  return arr;
};
const group2 = async () => {
  let arr = [];

  for (let i = 536; i < 1072; i++) {
    const countryNameArr = allCountries[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 1];

    const output = await fs.promises.readFile(
      `./_rmaps/profiles/${countryName}.json`,
      "utf8"
    );

    obj = JSON.parse(output);
    arr.push(...obj.data);
    // console.log(countryName, i);
  }

  return arr;
};
const group3 = async () => {
  let arr = [];

  for (let i = 1072; i < 1608; i++) {
    const countryNameArr = allCountries[i].split("/");
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
const group4 = async () => {
  let arr = [];

  for (let i = 1608; i < 2144; i++) {
    const countryNameArr = allCountries[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 1];

    const output = await fs.promises.readFile(
      `./_rmaps/profiles/${countryName}.json`,
      "utf8"
    );

    obj = JSON.parse(output);
    arr.push(...obj.data);
    // console.log(countryName, i);
  }

  return arr;
};
const group5 = async () => {
  let arr = [];

  for (let i = 2144; i < 2682; i++) {
    const countryNameArr = allCountries[i].split("/");
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
  group3,
  group4,
  group5,
};
