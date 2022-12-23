// add new data or update those that need to be updated
const Independants = require("../models/Independant");

const addNewIndependant = async (newItem) => {
  // get item
  const isExist = await Independants.findOne({
    profileLink: newItem.profileLink,
  });
  // check if needs to update
  if (isExist && isExist.needUpdate) {
    // get those that are hidded (hidded when need to be updated sms & email)
    // check if new value have the values and update
    //SMS
    if (isExist.sms === "need" && newItem.sms !== "need") {
      try {
        isExist.sms = newItem.sms;
        await isExist.save();
        console.log(`${newItem.name} sms updated`);
      } catch (error) {
        console.log(error, "error upadating sms");
      }
    }
    //EMAIL
    if (isExist.email === "need" && newItem.email !== "need") {
      try {
        isExist.email = newItem.email;
        await isExist.save();
        console.log(`${newItem.name} email updated`);
      } catch (error) {
        console.log(error, "error upadating email");
      }
    }
  }
  // else just add new record
  const indep = new Independants(newItem);
  try {
    await indep.save();
    console.log(`${newItem.name} added`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = addNewIndependant;
