import { createLogger, format, transports } from 'winston';


const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    transports: [
      new transports.File({ filename: 'logs/generic-errors.log', level: 'error'}),
      new transports.File({ filename: 'logs/generic.log' }),
    ]
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.combine(
        format.timestamp({
          format: 'HH:mm:ss',
        }),
        format.colorize(),
        format.simple(),
        format.printf(
          info => `[${info.timestamp}] ${info.level}: ${info.message}`
        )
      )
    }));
  }

  export class Logger {

    public static info(message: any) {
        logger.info(message);
    }

    public static error(message: any) {
        logger.error(message);
        if (process.env.NODE_ENV !== 'production') {
          // If the message contains stack trace print it for easier debugging
          if (message.stack) console.log(message.stack);
        }
    }
  }