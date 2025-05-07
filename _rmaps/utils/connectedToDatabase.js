const mongoose = require("mongoose");

async function connectedToDatabase(cb = () => {}) {
  try {
    mongoose.set("strictQuery", false);
    const connected = await mongoose.connect(process.env.DBURI);
    if (connected) {
      console.log("[INFO] Connectde to db");
      if (cb && typeof cb === "function") cb();
      return true;
    }
  } catch (error) {
    console.error("[ERROR] Connecting to MongoDB:", error.message);
    return false;
  }
}

module.exports = { connectedToDatabase };
