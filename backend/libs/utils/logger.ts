import 'process';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const logDir = 'logs';

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const options = {
  file: {
    level: 'info',
    filename: `%DATE%.log`,
    dirname: logDir,
    maxFiles: 30,
    zippedArchive: true,
    format: combine(timestamp(), format.json()),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: combine(
      format.colorize(),
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      logFormat,
    ),
  },
};

export const logger = createLogger({
  transports: [
    new transports.DailyRotateFile(options.file),
    new transports.DailyRotateFile({
      ...options.file,
      level: 'error',
      filename: `%DATE%.error.log`,
    }),
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile({
      ...options.file,
      level: 'error',
      filename: `%DATE%.exception.log`,
    }),
  ],
});

// morgan wiston 설정
export const stream = {
  write: (message) => {
    logger.info(message);
  },
};

if (process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test') {
  logger.add(new transports.Console(options.console));
}
