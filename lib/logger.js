import winston from 'winston';

const LEVELS = {
  error: 0,
  warning: 1,
  okay: 2,
  info: 3
};

let logger = winston.createLogger({
  levels: LEVELS,
  format: winston.format.combine(
    winston.format.colorize({ message: true, colors: { info: "blue", okay: "green" } }),
    winston.format.printf(({ message }) => message)
  ),
  transports: [ new winston.transports.Console({ colorize: true }) ]
});

logger.okay = (message) => {
  logger.log({
    level: 'okay',
    message
  });
};

export default logger;
