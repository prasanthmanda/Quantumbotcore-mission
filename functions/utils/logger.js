const fs = require("fs");
const path = require("path");
const winston = require("winston");

// Define the log file path dynamically based on the location of logger.js
const logDir = path.join(__dirname);
const logFilePath = path.join(logDir, "app.log");

// Ensure the log file exists
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "");
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({level, message, timestamp, ...metadata}) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(metadata).length > 0) {
          msg += ` ${JSON.stringify(metadata)}`;
        }
        return msg;
      }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: logFilePath}),
  ],
});

module.exports = logger;
