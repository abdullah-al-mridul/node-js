/**
 * @author Abdullah Al Mridul
 * @date 2024-10-06
 * @description This is the route configuration for mapping paths to their respective handlers.
 */

// Import route handlers
const homeHandler = require("../handlers/homeHandler");
const aboutHandler = require("../handlers/aboutHandler");
const { userHandler } = require("../handlers/userHandler");
const { tokenHandler } = require("../handlers/tokenHandler");
const { checkHandler } = require("../handlers/checkHandler");
const notFoundHandler = require("../handlers/notFoundHandler"); // Fallback handler for undefined routes

/**
 * Route Object
 * Each key represents a route path, and its value is the corresponding handler.
 */
const routes = {
  "": homeHandler, // Home route
  about: aboutHandler, // About page route
  user: userHandler, // User-related operations route
  token: tokenHandler, // Token management route
  notFound: notFoundHandler, // Fallback route for 404 errors
  check: checkHandler, // Check route
};

// Export the routes for use in the server configuration
module.exports = routes;
