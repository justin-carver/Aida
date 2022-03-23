import winston from 'winston';
import * as conf from './config.json';

const readFromConfig = (configProperty) => {
    if (configProperty == undefined) {
        let e = `Error attempting to read config property for ${configProperty}. Not found within the config.json! Double-check config property spelling.`;
        throw new Error(e);
    } else {
        return configProperty;
    }
}

// TODO: Fix/Update transports to log accurate levels and info to the all necessary log files below.
const logger = winston.createLogger({
    // TODO: Import logger level from config file.
    level: readFromConfig(conf.default.aida.logLevel),
    format: winston.format.combine(
        // winston.format.colorize(),
        winston.format.timestamp(),
        readFromConfig(conf.default.aida.logOutputAsJson) ? winston.format.json() : winston.format.simple(),
    ),
    // exitOnError: true,
    transports: [
        new winston.transports.Console({ format: readFromConfig(conf.default.aida.logOutputAsJson) ? winston.format.json() : winston.format.simple() }),
        new winston.transports.File({ filename: 'error.log', level: 'error'}),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

export { logger, readFromConfig };