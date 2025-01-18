/**
 * @author Abdullah Al Mridul
 * @date 2024-10-05
 * @description This is utilities functions
 */

//modules
const crypto = require("crypto");

//utilities object
const utilities = {};

utilities.parseObjectToString = (obj) => {
  if (typeof obj === "object" && obj !== null) {
    return JSON.stringify(obj);
  } else {
    return false;
  }
};

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

//token
utilities.token = (strLength) => {
  strLength = typeof strLength === "number" ? strLength : false;
  if (!strLength) return false;
  const tokenCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let token = "";
  for (i = 0; i < strLength; i++) {
    const randomCharacter = tokenCharacters.charAt(
      Math.floor(Math.random() * tokenCharacters.length)
    );
    token += randomCharacter;
  }
  return token;
};

module.exports = utilities;
