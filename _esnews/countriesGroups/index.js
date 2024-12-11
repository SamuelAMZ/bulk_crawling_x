// country groups get from json files
const fs = require("fs");
const countriesLinks = require("../entry");

/**
 * Helper function to process a range of indices and return the aggregated data.
 * @param {number} start - Start index of the range.
 * @param {number} end - End index of the range.
 * @returns {Promise<Array>} - An array of combined data from the specified range.
 */
const processGroup = async (start, end, groupName) => {
  let arr = [];
  console.log(
    `[INFO] Starting processing for ${groupName}, range: ${start}-${end}`
  );

  for (let i = start; i < end; i++) {
    try {
      const countryNameArr = countriesLinks[i].split("/");
      const countryName = countryNameArr[countryNameArr.length - 1];
      console.log(`[INFO] Processing country: ${countryName}, index: ${i}`);

      const filePath = `./_esnews/profiles/${countryName}.json`;
      console.log(`[INFO] Reading file: ${filePath}`);
      const output = await fs.promises.readFile(filePath, "utf8");

      const obj = JSON.parse(output);
      arr.push(...obj.data);
      console.log(
        `[INFO] Successfully processed: ${countryName}, added ${obj.data.length} entries.`
      );
    } catch (error) {
      console.error(
        `[ERROR] Failed to process index ${i} in ${groupName}: ${error.message}`
      );
    }
  }

  console.log(
    `[INFO] Completed processing for ${groupName}, total entries: ${arr.length}`
  );
  return arr;
};

// Define groups with appropriate ranges
const group1 = async () => await processGroup(3, 21, "Group 1");
const group2 = async () => await processGroup(30, 42, "Group 2");
const group3 = async () => await processGroup(45, 63, "Group 3");
const group4 = async () => await processGroup(81, 84, "Group 4");
const group5 = async () => await processGroup(89, 107, "Group 5");

module.exports = { group1, group2, group3, group4, group5 };
