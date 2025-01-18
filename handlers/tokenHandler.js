/**
 * @author Abdullah Al Mridul
 * @date 2024-10-09
 * @description Handles token-related requests (create, read, update, delete)
 */

// Modules
const { hash, token, parseJsonToObject } = require("../helpers/utilities");
const { read, create, update, del } = require("../lib/data");

// Token handler object
const handler = {};

/**
 * Main handler for token routes
 * @param {Object} reqProperties - Contains details of the request (method, body, queryString)
 * @param {Function} callback - Function to return the response
 */
handler.tokenHandler = (reqProperties, callback) => {
  const acceptedMethods = ["post", "get", "put", "delete"];
  const method = reqProperties.method.toLowerCase();

  // Check if the request method is valid
  if (!acceptedMethods.includes(method)) {
    return callback(405, { msg: "Method not allowed" });
  }

  // Delegate request to appropriate method handler
  handler._tokens[method](reqProperties, callback);
};

// Sub-handler for user operations (post, get, put, delete)
handler._tokens = {};

/**
 * Create a new token
 * @param {Object} reqProperties - Request details
 * @param {Function} callback - Callback to send response
 */
handler._tokens.post = (reqProperties, callback) => {
  let { password, email } = reqProperties.body;

  // Validate user data
  password =
    typeof password === "string" && password.trim().length > 0
      ? password
      : false;
  email = typeof email === "string" && email.trim().length > 0 ? email : false;

  // Check if all required fields are provided
  if (email && password) {
    read("users", email, (err, userData) => {
      if (err) {
        return callback(500, { msg: "Failed to find user" });
      }

      const hashedPassword = hash(password);
      const tokenID = token(50);
      const expires = Date.now() + 1000 * 60 * 60 * 24;
      const tokenData = {
        email,
        token: tokenID,
        expires,
      };

      //check password
      if (hashedPassword === parseJsonToObject(userData).password) {
        create("tokens", tokenID, tokenData, (err) => {
          if (!err) {
            callback(200, tokenData);
          } else {
            callback(500, { msg: "Failed to create token" });
          }
        });
      } else {
        callback(400, { msg: "Invalid password" });
      }
    });
    // callback(200, { msg: "Token created successfully" });
  } else {
    callback(400, { msg: "Missing required fields" });
  }
};

/**
 * Retrieve token data
 * @param {Object} reqProperties - Request details
 * @param {Function} callback - Callback to send response
 */
handler._tokens.get = (reqProperties, callback) => {
  let { id } = reqProperties.queryStringObject;

  // Validate token
  id = typeof id === "string" && id.trim().length === 50 ? id : false;

  // Check if token is valid
  if (id) {
    // Find token in the database
    read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        callback(200, parseJsonToObject(tokenData));
      } else {
        callback(404, { msg: "Token not found" });
      }
    });
  } else {
    callback(400, { msg: "Invalid token" });
  }
};

/**
 * Update token data
 * @param {Object} reqProperties - Request details
 * @param {Function} callback - Callback to send response
 */
handler._tokens.put = (reqProperties, callback) => {
  let { id, extend } = reqProperties.body;

  // Validate token and extend
  id = typeof id === "string" && id.trim().length === 50 ? id : false;
  extend = typeof extend === "boolean" ? extend : false;

  // Check if token is valid
  if (id && extend) {
    // Find token in the database
    read("tokens", id, (err, tokenData) => {
      if (!err) {
        let tokenInfo = parseJsonToObject(tokenData);
        // Check if token is not expired
        if (Date.now() < tokenInfo.expires) {
          tokenInfo.expires = Date.now() + 1000 * 60 * 60 * 24;
          // Update token in the database
          update("tokens", id, tokenInfo, (err) => {
            if (!err) {
              callback(200, { msg: "Token extended successfully" });
            } else {
              callback(500, { msg: "Failed to extend token" });
            }
          });
        } else {
          callback(400, { msg: "Token expired" });
        }
      } else {
        callback(400, { msg: "Token not found" });
      }
    });
  } else {
    callback(400, { msg: "Invalid token" });
  }
};

/**
 * Delete token
 * @param {Object} reqProperties - Request details
 * @param {Function} callback - Callback to send response
 */
handler._tokens.delete = (reqProperties, callback) => {
  let { id } = reqProperties.queryStringObject;

  // Validate token
  id = typeof id === "string" && id.trim().length === 50 ? id : false;

  // Check if token is valid
  if (id) {
    // Find token in the database
    read("tokens", id, (err, tokenData) => {
      if (!err) {
        const tokenInfo = parseJsonToObject(tokenData);
        // Delete token from the database
        del("tokens", id, (err) => {
          if (!err) {
            callback(200, { msg: "Token deleted successfully", tokenInfo });
          } else {
            callback(500, { msg: "Failed to delete token" });
          }
        });
      } else {
        callback(400, { msg: "Token not found" });
      }
    });
  } else {
    callback(400, { msg: "Invalid token" });
  }
};

handler._tokens.verify = (id, email, callback) => {
  read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      const tokenInfo = parseJsonToObject(tokenData);
      if (tokenInfo.email === email && tokenInfo.expires > Date.now()) {
        callback(true, { msg: "Token verified successfully" });
      } else {
        callback(false, { msg: "Invalid token" });
      }
    } else {
      callback(false, { msg: "Token not found" });
    }
  });
};

// Export the handler
module.exports = handler;
