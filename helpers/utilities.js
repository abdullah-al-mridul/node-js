/**
 * @author Abdullah Al Mridul
 * @date 2024-10-05
 * @description This is utilities functions
 */

//modules
const crypto = require("crypto");

//utilities object
const utilities = {};

//parse json to object
utilities.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

//hash
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = require("crypto")
      .createHash("sha256")
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

module.exports = utilities;
