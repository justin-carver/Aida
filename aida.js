import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as conf from './config.json';
import { logger, readFromConfig} from './helper.js';
import initScheduler from './scheduler.js';

// https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
const getAllFiles = function(dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
        }
    });
    return arrayOfFiles
}

const importCategory = (jsonPath) => {
    fs.readFileSync(jsonPath, 'utf8', (err, data) => {
        // TODO: Verify if the document we are attempting to import is a JSON document.
        if (err) {
            logger.error('JSON category document not found! Is the path set correctly?');
            throw err;
        }
        assignCategory(data, jsonPath);
    });
}

const assignCategory = (json, path) => {
    logger.info(`Creating and assigning category for: ${path} ${json}!`);
}

const aidaInit = () => {
    logger.info(`Display config file contents: ${JSON.stringify(readFromConfig(conf.default.aida))}${JSON.stringify(readFromConfig(conf.default.calendar))}`);
    const categoryDir = readFromConfig(conf.default.aida.categoryDirectory);
    const categories = getAllFiles(categoryDir);
    console.log(categories);
    for (let x = 0; x < categories.length; x++) {
        logger.info(`Importing tweet category from: ${categories[x]}`);
        importCategory(categories[x]);
    }
    initScheduler();
}

aidaInit();