/**
 * @author Abdullah Al Mridul
 * @date 2024-10-05
 * @description This is a 404 handler
 */

//handler
const notFoundHandler = (reqProperties, callback) => {
  const props = { ...reqProperties };
  callback(404, {
    message: "Page not found",
    statusCode: 404,
    data: {},
    props,
  });
};

module.exports = notFoundHandler;
