// check if actual item is not already in db
// if yes check if it need to be updated
// if yes return true else false
const Independants = require("../models/Independant");

const checkIndependant = async (actual) => {
  // check if actual item is not already in db
  try {
    const isExist = await Independants.findOne({ profileLink: actual });
    if (!isExist) {
      return false;
    }
    // if yes check if it need to be updated
    return !isExist.needUpdate;
  } catch (error) {
    console.log(error, "check independant");
    return false;
  }
};

module.exports = checkIndependant;
