const morgan = require("morgan");
const {logger} = require("../config/logger");

const requestLogger = morgan("combined", {
  stream: {
    write: (msg) => logger.info(msg.trim())
  }
});

module.exports = requestLogger;
