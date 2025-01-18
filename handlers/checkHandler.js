/**
 * @author Abdullah Al Mridul
 * @date 18/01/2025
 * @description Handles check-related requests (create, read, update, delete)
 */

// Modules
const { parseJsonToObject, token } = require("../helpers/utilities");
const { read, create, update, del } = require("../lib/data");
const { _tokens } = require("../handlers/tokenHandler");

// User handler object
const handler = {};

let createRandomString = token;

handler.checkHandler = (reqProperties, callback) => {
  const acceptedMethods = ["post", "get", "put", "delete"];
  const method = reqProperties.method.toLowerCase();

  // Check if the request method is valid
  if (!acceptedMethods.includes(method)) {
    return callback(405, { msg: "Method not allowed" });
  }

  // Delegate request to appropriate method handler
  handler._checks[method](reqProperties, callback);
};

// Sub-handler's for user operations (post, get, put, delete)
handler._checks = {};

handler._checks.post = (reqProperties, callback) => {
  let { protocol, url, method, successCodes, timeOutSeconds } =
    reqProperties.body;
  let PROTOCOL =
    typeof protocol === "string" && ["http", "https"].indexOf(protocol) > -1
      ? protocol
      : false;
  let URL = typeof url === "string" && url.trim().length > 0 ? url : false;
  let METHOD =
    typeof method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(method) > -1
      ? method
      : false;
  let SUCCESS_CODES =
    typeof successCodes === "object" && successCodes instanceof Array
      ? successCodes
      : false;
  let TIME_OUT_SECONDS =
    typeof timeOutSeconds === "number" &&
    timeOutSeconds % 1 === 0 &&
    timeOutSeconds >= 0 &&
    timeOutSeconds <= 5
      ? timeOutSeconds
      : false;
  //check if one of the required fields are provided...
  if (PROTOCOL && URL && METHOD && SUCCESS_CODES && TIME_OUT_SECONDS) {
    const token =
      typeof reqProperties.headersObject.token === "string"
        ? reqProperties.headersObject.token
        : false;
    //lookup user with token
    read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        userEmail = parseJsonToObject(tokenData).email;
        // lookup user with email
        read("users", userEmail, (err, userData) => {
          if (!err && userData) {
            _tokens.verify(token, userEmail, (isTokenValid) => {
              if (isTokenValid) {
                const userObject = parseJsonToObject(userData);
                let userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];
                if (userChecks.length < 5) {
                  let checkId = createRandomString(20);
                  let checkObject = {
                    id: checkId,
                    userEmail,
                    protocol: PROTOCOL,
                    url: URL,
                    method: METHOD,
                    successCodes: SUCCESS_CODES,
                    timeOutSeconds: TIME_OUT_SECONDS,
                  };
                  //save the object to database
                  create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      //add check to user object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);
                      //update user object in database
                      update("users", userEmail, userObject, (err) => {
                        if (!err) {
                          callback(200, checkObject);
                        } else {
                          callback(500, { msg: "Failed to update user check" });
                        }
                      });
                    } else {
                      callback(500, { msg: "Failed to create check" });
                    }
                  });
                } else {
                  callback(401, {
                    error: "User has already reached max check limit",
                  });
                }
              } else {
                callback(403, {
                  msg: "Invalid token or authentication failed",
                });
              }
            });
          } else {
            callback(403, { msg: "User not found" });
          }
        });
      } else {
        callback(403, { msg: "Invalid token or authentication failed" });
      }
    });
  } else {
    callback(400, { msg: "Invalid request" });
  }
};

handler._checks.get = (reqProperties, callback) => {
  const id =
    typeof reqProperties.queryStringObject.id === "string" &&
    reqProperties.queryStringObject.id.trim().length > 0
      ? reqProperties.queryStringObject.id
      : false;
  if (id) {
    read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof reqProperties.headersObject.token === "string"
            ? reqProperties.headersObject.token
            : false;
        let userEmail = parseJsonToObject(checkData).userEmail;
        _tokens.verify(token, userEmail, (isTokenValid) => {
          if (isTokenValid) {
            callback(200, parseJsonToObject(checkData));
          } else {
            callback(403, { msg: "Invalid token or authentication failed" });
          }
        });
      } else {
        callback(404, { msg: "Check not found" });
      }
    });
  } else {
    callback(400, { msg: "Invalid request" });
  }
};

handler._checks.put = (reqProperties, callback) => {
  let { protocol, url, method, successCodes, timeOutSeconds } =
    reqProperties.body;
  const id =
    typeof reqProperties.body.id === "string" &&
    reqProperties.body.id.trim().length > 0
      ? reqProperties.body.id
      : false;
  let PROTOCOL =
    typeof protocol === "string" && ["http", "https"].indexOf(protocol) > -1
      ? protocol
      : false;
  let URL = typeof url === "string" && url.trim().length > 0 ? url : false;
  let METHOD =
    typeof method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(method) > -1
      ? method
      : false;
  let SUCCESS_CODES =
    typeof successCodes === "object" && successCodes instanceof Array
      ? successCodes
      : false;
  let TIME_OUT_SECONDS =
    typeof timeOutSeconds === "number" &&
    timeOutSeconds % 1 === 0 &&
    timeOutSeconds >= 0 &&
    timeOutSeconds <= 5
      ? timeOutSeconds
      : false;
  if (id) {
    if (PROTOCOL || URL || METHOD || SUCCESS_CODES || TIME_OUT_SECONDS) {
      read("checks", id, (err, checkData) => {
        if (!err && checkData) {
          let checkObject = parseJsonToObject(checkData);
          checkObject.protocol = PROTOCOL || checkObject.protocol;
          checkObject.url = URL || checkObject.url;
          checkObject.method = METHOD || checkObject.method;
          checkObject.successCodes = SUCCESS_CODES || checkObject.successCodes;
          checkObject.timeOutSeconds =
            TIME_OUT_SECONDS || checkObject.timeOutSeconds;
          const token =
            typeof reqProperties.headersObject.token === "string"
              ? reqProperties.headersObject.token
              : false;
          _tokens.verify(token, checkObject.userEmail, (isTokenValid) => {
            if (isTokenValid) {
              update("checks", id, checkObject, (err) => {
                if (!err) {
                  callback(200, checkObject);
                } else {
                  callback(500, { msg: "Failed to update check" });
                }
              });
            } else {
              callback(403, { msg: "Invalid token or authentication failed" });
            }
          });
        } else {
          callback(404, { msg: "Check not found" });
        }
      });
    } else {
      callback(400, { msg: "Invalid update request" });
    }
  } else {
    callback(400, { msg: "Invalid request" });
  }
};

handler._checks.delete = (reqProperties, callback) => {
  const id =
    typeof reqProperties.queryStringObject.id === "string" &&
    reqProperties.queryStringObject.id.trim().length > 0
      ? reqProperties.queryStringObject.id
      : false;
  if (id) {
    read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof reqProperties.headersObject.token === "string"
            ? reqProperties.headersObject.token
            : false;
        let userEmail = parseJsonToObject(checkData).userEmail;
        _tokens.verify(token, userEmail, (isTokenValid) => {
          if (isTokenValid) {
            //delete check from database
            del("checks", id, (err) => {
              if (!err) {
                //delete check from user object
                read("users", userEmail, (err, userData) => {
                  if (!err && userData) {
                    let userObject = parseJsonToObject(userData);
                    let userChecks =
                      typeof userObject.checks === "object" &&
                      userObject.checks instanceof Array
                        ? userObject.checks
                        : [];
                    userChecks = userChecks.filter((checkId) => checkId !== id);
                    userObject.checks = userChecks;
                    update("users", userEmail, userObject, (err) => {
                      if (!err) {
                        callback(200, { msg: "Check deleted successfully" });
                      } else {
                        callback(500, {
                          msg: "Failed to delete check from user object in server",
                        });
                      }
                    });
                  } else {
                    callback(500, {
                      msg: "Failed to delete check from user object",
                    });
                  }
                });
              } else {
                callback(500, { msg: "Failed to delete check" });
              }
            });
          } else {
            callback(403, { msg: "Invalid token or authentication failed" });
          }
        });
      } else {
        callback(404, { msg: "Check not found" });
      }
    });
  } else {
    callback(400, { msg: "Invalid request" });
  }
};

// Export the handler
module.exports = handler;
