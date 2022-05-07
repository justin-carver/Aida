import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import winston from 'winston';
import * as conf from './config.json' assert { type: 'json' };

let categoryObj = {}; // Holds all imported categories

const readFromConfig = (configProperty) => {
    if (configProperty == undefined) {
        let e = `Error attempting to read config property for ${configProperty}. Not found within the config.json! Double-check config property spelling.`;
        throw new Error(e);
    } else {
        return configProperty;
    }
};

const resetCategoryObj = () => (categoryObj = {});

const importCategory = (jsonPath) => {
    logger.debug(`Attemping to import category document from ${jsonPath}...`);
    assignCategory(fs.readFileSync(jsonPath, 'utf8'), jsonPath);
};

const assignCategory = (data, path) => {
    try {
        logger.info(`Creating and assigning category for: ${path}!`);
        categoryObj[path.split('\\').pop()] = JSON.parse(data);
    } catch (e) {
        throw new Error(`Could not parse JSON document! Is your JSON valid? | ${e}`);
    }
};

const getAllFiles = (dirPath, arrayOfFiles) => {
    let files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, '/', file));
        }
    });

    if (readFromConfig(conf.default.aida.singleFile)) {
        return arrayOfFiles.filter((file) =>
            file.includes(readFromConfig(conf.default.aida.singleFile))
        );
    } else {
        return arrayOfFiles;
    }
};

const carmen = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    readFromConfig(conf.default.aida.logOutputAsJson)
        ? winston.format.json()
        : winston.format.simple()
);

const logger = winston.createLogger({
    level: readFromConfig(conf.default.aida.logLevel),
    format: carmen,
    transports: [
        new winston.transports.Console({
            format: readFromConfig(conf.default.aida.logOutputAsJson)
                ? winston.format.json()
                : winston.format.simple(),
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

const defaultPostingInterval = {
    2: {
        start: '09:00',
        end: '11:00',
    },
    3: {
        start: '09:00',
        end: '15:00',
    },
    4: {
        start: '09:00',
        end: '11:00',
    },
};

export {
    logger,
    readFromConfig,
    defaultPostingInterval,
    getAllFiles,
    assignCategory,
    importCategory,
    categoryObj,
    resetCategoryObj,
};
