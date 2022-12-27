// country groups get from json files
const fs = require("fs");
const countriesLinks = require("../entry");

const group1 = async () => {
  let arr = [];

  for (let i = 4; i < 21; i++) {
    const countryNameArr = countriesLinks[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 2];

    const output = await fs.promises.readFile(
      `./_euro/profiles/${countryName}.json`,
      "utf8"
    );

    obj = JSON.parse(output);
    arr.push(...obj.data);
  }

  return arr;
};

const group2 = async () => {
  let arr = [];

  for (let i = 32; i < 42; i++) {
    const countryNameArr = countriesLinks[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 2];

    const output = await fs.promises.readFile(
      `./_euro/profiles/${countryName}.json`,
      "utf8"
    );

    obj = JSON.parse(output);
    arr.push(...obj.data);
  }

  return arr;
};

const group3 = async () => {
  let arr = [];

  for (let i = 42; i < 63; i++) {
    const countryNameArr = countriesLinks[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 2];

    const output = await fs.promises.readFile(
      `./_euro/profiles/${countryName}.json`,
      "utf8"
    );

    obj = JSON.parse(output);
    arr.push(...obj.data);
  }

  return arr;
};

const group4 = async () => {
  let arr = [];

  for (let i = 63; i < 84; i++) {
    const countryNameArr = countriesLinks[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 2];

    const output = await fs.promises.readFile(
      `./_euro/profiles/${countryName}.json`,
      "utf8"
    );

    obj = JSON.parse(output);
    arr.push(...obj.data);
  }

  return arr;
};

const group5 = async () => {
  let arr = [];

  for (let i = 84; i < 118; i++) {
    const countryNameArr = countriesLinks[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 2];

    const output = await fs.promises.readFile(
      `./_euro/profiles/${countryName}.json`,
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
