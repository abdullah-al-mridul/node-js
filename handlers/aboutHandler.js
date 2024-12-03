/**
 * @author Abdullah Al Mridul
 * @date 2024-10-05
 * @description Handles requests to the about route and provides a response.
 */

/**
 * About Handler Function
 * @param {Object} reqProperties - Contains details about the incoming request.
 * @param {Function} callback - Function to send the response.
 */
const aboutHandler = (reqProperties, callback) => {
  // Extract specific request properties if needed
  const { method, query, headers, path } = reqProperties;

  // Construct the response
  const response = {
    message: "Welcome to the about page",
    statusCode: 200,
    data: {
      info: "This page contains information about our service.",
    },
    requestDetails: { method, query, headers, path },
  };

  // Send the response
  callback(200, response);
};

// Export the handler for use in the route configuration
module.exports = aboutHandler;
