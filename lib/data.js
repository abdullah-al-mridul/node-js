/**
 * @author Abdullah Al Mridul
 * @date 2024-10-08
 * @description This is a 404 handler
 */

//modules
const fs = require("fs");
const path = require("path");

// data object
const lib = {};

//creating base directory
lib.baseDir = path.join(__dirname, "/../data/");

//creating a new file
lib.create = (path, fileName, data, callback) => {
  fs.open(`${lib.baseDir + path}/${fileName}.json`, "wx", (err, dispactor) => {
    if (!err && dispactor) {
      callback(false);
      fs.writeFile(dispactor, JSON.stringify(data), (err) => {
        if (!err) {
          fs.close(dispactor, (err) => {
            if (!err) {
              console.log("File created successfully");
            } else {
              callback("Error closing the file", err);
            }
          });
        } else {
          callback("Error writing to the file", err);
        }
      });
    } else {
      callback("Error creating file", err);
    }
  });
};

//reading a file
lib.read = (path, fileName, callback) => {
  fs.readFile(
    `${lib.baseDir + path}/${fileName}.json`,
    { encoding: "utf-8", flag: "r+" },
    (err, data) => {
      if (!err) {
        callback(false, data);
      } else {
        callback("Error reading file", err);
      }
    }
  );
};

//update file
lib.update = (path, fileName, data, callback) => {
  fs.open(`${lib.baseDir + path}/${fileName}.json`, "r+", (err, fd) => {
    if (!err && fd) {
      fs.ftruncate(fd, () => {
        fs.writeFile(fd, JSON.stringify(data), (err) => {
          if (!err) {
            fs.close(fd, (err) => {
              if (!err) {
                console.log("File updated successfully");
                callback(err, data);
              } else {
                callback("Error closing the file", err);
              }
            });
          } else {
            callback("Error writing to the file", err);
          }
        });
      });
    } else {
      callback("Error opening file", err);
    }
  });
};

//delete file
lib.del = (path, fileName, callback) => {
  fs.unlink(`${lib.baseDir + path}/${fileName}.json`, (err) => {
    if (!err) {
      console.log("File deleted successfully");
      callback(false, {
        msg: "file deleted",
      });
    } else {
      console.log("Error deleting file", err);
      callback("Error deleting file", err);
    }
  });
};

module.exports = lib;
