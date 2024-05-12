import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// Configure Winston logger
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new DailyRotateFile({
      dirname: 'logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m', // Maximum size of log files before rotation (e.g., 20 MB)
      maxFiles: '7d', // Retain log files for 7 days
    }),
  ],
})
