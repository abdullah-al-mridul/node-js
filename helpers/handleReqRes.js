/**
 * @author Abdullah Al Mridul
 * @date 2024-10-05
 * @description This is req,res handler
 */

// modules
const { URL } = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes/route");
const notFoundHandler = require("../handlers/notFoundHandler");
const { parseJsonToObject } = require("../helpers/utilities");

// handler object
const handler = {};

handler.handleReqRes = (param) => {
  const { req, res } = param;

  // Parse URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = Object.fromEntries(parsedUrl.searchParams);
  const headersObject = req.headers;

  const reqProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };

  // Detect route handler
  const detectHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  // Handle incoming data
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();
    const parsedBody = parseJsonToObject(buffer);
    reqProperties.body = parsedBody;

    // Handle CORS and OPTIONS preflight
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (method === "options") {
      res.writeHead(204);
      return res.end();
    }

    // Execute route handler
    detectHandler(reqProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" && payload !== null ? payload : {};

      // Structured response
      const responsePayload = {
        success: statusCode >= 200 && statusCode < 300,
        data: payload,
      };

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify(responsePayload));
    });
  });
};

module.exports = handler;
