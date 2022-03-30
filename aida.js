import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as conf from './config.json';
import { logger, readFromConfig} from './helper.js';
import initScheduler from './scheduler.js';

const getAllFiles = (dirPath, arrayOfFiles) => {
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
    logger.debug(`Attemping to import category document from ${jsonPath}...`);
    assignCategory(fs.readFileSync(jsonPath, 'utf8'), jsonPath);
}

const assignCategory = (data, path) => {
    // Categories are assigned object variables that can be access from scheduler.js.
    // const object = {categoryData}; something like this, then export the object.
    logger.info(`Creating and assigning category for: ${path} ${data}!`);
}

const aidaInit = () => {
    logger.info(`Display config file contents: ${JSON.stringify(readFromConfig(conf.default.aida))}${JSON.stringify(readFromConfig(conf.default.calendar))}`);
    const categoryDir = readFromConfig(conf.default.aida.categoryDirectory);
    const categories = getAllFiles(categoryDir);
    console.log(categories);
    for (let x = 0; x < categories.length; x++) {
        importCategory(categories[x]);
        logger.info(`Successfully imported tweet category from: ${categories[x]}! Let's start tweeting!`);
    }
    initScheduler();
    logger.info('Happy Tweeting! Aida will take care of the rest! 😉');
}

aidaInit();