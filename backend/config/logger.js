/**
 * Production-ready logging configuration
 */
const winston = require("winston");
const path = require("path");
require("dotenv").config();

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  verbose: "cyan",
  debug: "white",
  silly: "grey",
};

winston.addColors(colors);

// Format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),

  // Error log file
  new winston.transports.File({
    filename: path.join(__dirname, "../logs/error.log"),
    level: "error",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),

  // Combined log file
  new winston.transports.File({
    filename: path.join(__dirname, "../logs/combined.log"),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels,
  format,
  transports,
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/exceptions.log"),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/rejections.log"),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

// Create a stream object for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

/**
 * Log authentication events
 */
logger.logAuth = (event, userId, ip, userAgent, details = {}) => {
  logger.info("AUTH_EVENT", {
    event,
    userId,
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

/**
 * Log security events
 */
logger.logSecurity = (event, ip, userAgent, details = {}) => {
  logger.warn("SECURITY_EVENT", {
    event,
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

/**
 * Log API requests
 */
logger.logRequest = (req, res, responseTime) => {
  logger.http("API_REQUEST", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    statusCode: res.statusCode,
    responseTime,
    userId: req.user?.uid || "anonymous",
    timestamp: new Date().toISOString(),
  });
};

module.exports = logger;
