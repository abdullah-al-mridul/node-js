/**
 * @author Abdullah Al Mridul
 * @date 2024-10-09
 * @description Handles user-related requests (create, read, update, delete)
 */

// Modules
const { hash } = require("../helpers/utilities");
const { read, create, update, del } = require("../lib/data");

// User handler object
const handler = {};

/**
 * Main handler for user routes
 * @param {Object} reqProperties - Contains details of the request (method, body, queryString)
 * @param {Function} callback - Function to return the response
 */
handler.userHandler = (reqProperties, callback) => {
  const acceptedMethods = ["post", "get", "put", "delete"];
  const method = reqProperties.method.toLowerCase();

  // Check if the request method is valid
  if (!acceptedMethods.includes(method)) {
    return callback(405, { msg: "Method not allowed" });
  }

  // Delegate request to appropriate method handler
  handler._users[method](reqProperties, callback);
};

// Sub-handler for user operations (post, get, put, delete)
handler._users = {};

/**
 * Create a new user
 * @param {Object} reqProperties - Request details
 * @param {Function} callback - Callback to send response
 */
handler._users.post = (reqProperties, callback) => {
  let { firstName, lastName, email, password, tos, phone } = reqProperties.body;

  // Validate user data
  firstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName
      : false;
  lastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName
      : false;
  phone = typeof phone === "string" && phone.trim().length > 0 ? phone : false;
  email = typeof email === "string" && email.trim().length > 0 ? email : false;
  password =
    typeof password === "string" && password.trim().length > 0
      ? hash(password)
      : false;
  tos = typeof tos === "boolean" ? tos : false;

  // Check if all required fields are provided
  if (firstName && lastName && phone && email && password && tos) {
    const userData = { firstName, lastName, email, password, tos, phone };

    // Check if user already exists
    read("users", email, (err) => {
      if (err) {
        // Create the user
        create("users", email, userData, (err) => {
          if (!err) {
            callback(200, userData);
          } else {
            callback(500, { msg: "Failed to create user" });
          }
        });
      } else {
        callback(400, { msg: "Email already exists" });
      }
    });
  } else {
    callback(400, { msg: "Missing required fields" });
  }
};

/**
 * Retrieve user data
 * @param {Object} reqProperties - Request details
 * @param {Function} callback - Callback to send response
 */
handler._users.get = (reqProperties, callback) => {
  let { email } = reqProperties.queryStringObject;

  // Validate email
  email =
    typeof email === "string" && email.trim().length > 0
      ? email.replace(/(^"|"$)/g, "")
      : false;

  if (email) {
    // Read user data
    read("users", email, (err, data) => {
      if (!err && data) {
        const userData = { ...JSON.parse(data) };
        delete userData.password; // Remove password before sending
        callback(200, userData);
      } else {
        callback(404, { msg: "User not found", email });
      }
    });
  } else {
    callback(400, { msg: "Missing required field" });
  }
};

/**
 * Update user data
 * @param {Object} reqProperties - Request details
 * @param {Function} callback - Callback to send response
 */
handler._users.put = (reqProperties, callback) => {
  let { firstName, lastName, password, email } = reqProperties.body;

  // Validate fields
  firstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName
      : false;
  lastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName
      : false;
  password =
    typeof password === "string" && password.trim().length > 0
      ? hash(password)
      : false;
  email = typeof email === "string" && email.trim().length > 0 ? email : false;

  if (firstName || lastName || password) {
    // Check if the user exists
    read("users", email, (err, data) => {
      if (!err && data) {
        const userData = { ...JSON.parse(data) };

        // Update fields if provided
        if (firstName) userData.firstName = firstName;
        if (lastName) userData.lastName = lastName;
        if (password) userData.password = password;

        // Update user data
        update("users", email, userData, (err) => {
          if (!err) {
            delete userData.password; // Remove password from response
            callback(200, userData);
          } else {
            callback(500, { msg: "Failed to update user" });
          }
        });
      } else {
        callback(404, { msg: "User not found" });
      }
    });
  } else {
    callback(400, { msg: "Missing required fields" });
  }
};

/**
 * Delete user
 * @param {Object} reqProperties - Request details
 * @param {Function} callback - Callback to send response
 */
handler._users.delete = (reqProperties, callback) => {
  let { email } = reqProperties.queryStringObject;
  email =
    typeof email === "string" && email.trim().length > 0
      ? email.replace(/(^"|"$)/g, "")
      : false;

  if (email) {
    // Delete user data
    del("users", email, (err) => {
      if (!err) {
        callback(200, { msg: "User deleted successfully", email });
      } else {
        callback(404, { msg: "User not found", email });
      }
    });
  } else {
    callback(400, { msg: "Missing required field", email });
  }
};

// Export the handler
module.exports = handler;
