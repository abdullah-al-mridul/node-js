/**
 * @author Abdullah Al Mridul
 * @date 2024-10-05
 * @description Handles requests to the home route and sends a standard response.
 */

/**
 * Home Handler Function
 * @param {Object} reqProperties - Contains properties of the incoming request.
 * @param {Function} callback - Function to send the response.
 */
const homeHandler = (reqProperties, callback) => {
  // Extract request properties if needed (e.g., method, query, headers)
  const { method, query, headers, path } = reqProperties;

  // Construct the response object
  const response = {
    message: "Welcome to the home page",
    statusCode: 200,
    data: {},
    requestDetails: { method, query, headers, path },
  };

  // Send the response
  callback(200, response);
};

// Export the handler for use in the route configuration
module.exports = homeHandler;
