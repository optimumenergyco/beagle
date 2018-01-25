import winston from 'winston';

const LEVELS = {
  error: 0,
  warning: 1,
  success: 2,
  info: 3
};

let logger = winston.createLogger({
  levels: LEVELS,
  format: winston.format.combine(
    winston.format.colorize({ message: true, colors: { info: "blue", success: "green" } }),
    winston.format.printf(({ message }) => message)
  ),
  transports: [ new winston.transports.Console({ colorize: true }) ]
});

logger.success = (message) => {
  logger.log({
    level: 'success',
    message
  });
};

export default logger;
