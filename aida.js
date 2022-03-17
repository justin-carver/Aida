import fs from 'fs';
import { TwitterClient } from 'twitter-api-client';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import conf from './config.js'
import { logger } from './helper.js';
import initScheduler from './scheduler.js';

// Twitter API ------

const twitterClient = new TwitterClient({
    apiKey: conf.apiKey,
    apiSecret: conf.apiSecret,
    accessToken: conf.accessToken,
    accessTokenSecret: conf.accessTokenSecret
});

// Aida Core Logic ------
// !! Reading / Writing JSON using 'fs': https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js

const importCategory = (jsonPath) => {
    fs.readFile(__dirname + jsonPath, 'utf8', (err, data) => {
        if (err) {
            logger.error('JSON category document not found! Is the path set correctly?');
            throw err;
        }
        assignCategory(data, jsonPath);
    });
}

const assignCategory = (json, path) => {
    logger.info(`Creating and assigning category for: ${path}!`);
}

const aidaInit = () => {
    // TODO: Find a way to automate the population of categories from the directory.
    // For now, import category statements go here.
    importCategory('/categories/example.json');
    // importCategory('/categories/self-promotion.json');
    // importCategory('/categories/tutorials.json');
    // importCategory('/categories/articles.json');
    initScheduler();
}

aidaInit();