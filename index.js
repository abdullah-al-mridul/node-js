/**
 * @author Abdullah Al Mridul
 * @date 2024-10-05
 * @description Root node file __idx
 */

// modules
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");

// app config
const app = {
  port: process.env.PORT || 3000, // use environment variables
};

// create http server
app.createServer = () => {
  const server = http.createServer((req, res) =>
    app.handleReqRes({ req, res })
  );

  server.listen(app.port, () => {
    console.log(`Server running on port ${app.port}`);
  });

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("Shutting down server gracefully...");
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  });
};

// pushing handle req res handler to app object
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
