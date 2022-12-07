import * as dotenv from 'dotenv';
import { WinstonModule, utilities } from 'nest-winston';
import { join } from 'path';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

dotenv.config();
const logDir = join(__dirname, '..', '..', '..', 'logs');

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      utilities.format.nestLike('devrank', {
        prettyPrint: true,
      }),
    ),
  };
};

const transportOption = [new winstonDaily(dailyOptions('info')), new winstonDaily(dailyOptions('error'))] as any;

if (process.env.NODE_ENV === 'development') {
  transportOption.push(
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike('devrank', {
          prettyPrint: true,
          colors: true,
        }),
      ),
    }),
  );
}

export const logger = WinstonModule.createLogger({
  transports: transportOption,
});
