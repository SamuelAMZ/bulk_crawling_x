// country groups get from json files
const fs = require("fs");
const countriesLinks = require("../entry");

const group1 = async () => {
  let arr = [];

  for (let i = 14; i < 21; i++) {
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

  for (let i = 41; i < 42; i++) {
    const countryNameArr = countriesLinks[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 2];

    const output = await fs.promises.readFile(
      `./_euro/profiles/${countryName}.json`,
      "utf8"
    );

    obj = JSON.parse(output);
    arr.push(...obj.data);
    console.log(countryName, i);
  }

  return arr;
};

const group3 = async () => {
  let arr = [];

  for (let i = 55; i < 63; i++) {
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

  for (let i = 73; i < 84; i++) {
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

  for (let i = 110; i < 118; i++) {
    const countryNameArr = countriesLinks[i].split("/");
    const countryName = countryNameArr[countryNameArr.length - 2];

    const output = await fs.promises.readFile(
      `./_euro/profiles/${countryName}.json`,
      "utf8"
    );

    obj = JSON.parse(output);
    arr.push(...obj.data);
    console.log(countryName, i);
  }

  return arr;
};
group5();

module.exports = {
  group1,
  group2,
  group3,
  group4,
  group5,
};

// const arr = []
// Array.from(document.querySelector("#states").children).forEach(c => {
//   arr.push(c.innerText.replace(')', '').split('(')[1])²
// })
// let num = 0
// arr.forEach(e => {
//   num = num + Number(e)
// })
// console.log(num)
