const fs = require("fs");
const countriesLinks = require("../entry");

/**
 * Helper function to process a range of indices and return aggregated data.
 * @param {number} start - Start index of the range.
 * @param {number} end - End index of the range.
 * @param {string} groupName - Name of the group being processed.
 * @returns {Promise<Array>} - An array of combined data from the specified range.
 */
const processGroup = async (start, end, groupName) => {
  let arr = [];
  console.log(
    `[INFO] Starting processing for ${groupName}, range: ${start}-${end}`
  );

  for (let i = start; i < end; i++) {
    try {
      const countryLink = countriesLinks[i];
      if (!countryLink) {
        console.warn(
          `[WARN] No country link found at index ${i} in ${groupName}`
        );
        continue;
      }

      const countryNameArr = countryLink.split("/");
      const countryName = countryNameArr?.at(-2);

      if (!countryName) {
        console.warn(
          `[WARN] Unable to extract country name at index ${i} in ${groupName}`
        );
        continue;
      }

      const filePath = `./_euro/profiles/${countryName}.json`;
      console.log(`[INFO] Reading file: ${filePath}`);
      const output = await fs.promises.readFile(filePath, "utf8");

      const obj = JSON.parse(output);
      if (obj?.data) {
        arr.push(...obj.data);
        console.log(
          `[INFO] Successfully processed: ${countryName}, added ${obj.data.length} entries.`
        );
      } else {
        console.warn(`[WARN] No data found in file: ${filePath}`);
      }
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
const group1 = async () => await processGroup(14, 21, "Group 1");
const group2 = async () => await processGroup(41, 42, "Group 2");
const group3 = async () => await processGroup(55, 63, "Group 3");
const group4 = async () => await processGroup(73, 84, "Group 4");
const group5 = async () => await processGroup(110, 118, "Group 5");

// Run group5 for testing
(async () => {
  try {
    const data = await group5();
    console.log(`[INFO] Group 5 data loaded, total entries: ${data.length}`);
  } catch (error) {
    console.error(
      `[FATAL] Unhandled error in group5 execution: ${error.message}`
    );
  }
})();

// Export groups for reuse
module.exports = {
  group1,
  group2,
  group3,
  group4,
  group5,
};
