import winston from 'winston';
import * as conf from './config.json';

// TODO: Fix/Update transports to log accurate levels and info to the all necessary log files below.
const logger = winston.createLogger({
    // TODO: Import logger level from config file.
    level: conf.default.aida.logLevel,
    format: winston.format.combine(
        // winston.format.colorize(),
        winston.format.timestamp(),
        conf.default.aida.logOutputAsJson ? winston.format.json() : winston.format.simple(),
    ),
    // exitOnError: true,
    transports: [
        new winston.transports.Console({ format: conf.default.aida.logOutputAsJson ? winston.format.json() : winston.format.simple() }),
        new winston.transports.File({ filename: 'error.log', level: 'error'}),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

export { logger };