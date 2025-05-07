// this file will help with generating new a new random user agent
const UserAgent = require("user-agents");

const aNewUa = () => {
  let userAgent = new UserAgent({
    deviceCategory: "desktop",
    screenHeight: 800,
    screenWidth: 1280,
    platform: "Win32",
  });

  userAgent = userAgent.toString();

  return userAgent;
};

module.exports = { aNewUa };
