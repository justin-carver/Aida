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

const carmen = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    readFromConfig(conf.default.aida.logOutputAsJson) ? winston.format.json() : winston.format.simple()
);

const logger = winston.createLogger({
    level: readFromConfig(conf.default.aida.logLevel),
    format: carmen,
    transports: [
        new winston.transports.Console({ format: readFromConfig(conf.default.aida.logOutputAsJson) ? winston.format.json() : winston.format.simple() }),
        new winston.transports.File({ filename: 'error.log', level: 'error'}),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

const defaultPostingInterval = {
    "2" : {
        "start" : "09:00",
        "end" : "11:00"
    },
    "3" : {
        "start" : "09:00",
        "end" : "15:00"
    },
    "4" : {
        "start" : "09:00",
        "end" : "11:00"
    }
};

export { logger, readFromConfig, defaultPostingInterval };