import fs from 'fs';
import { TwitterClient } from 'twitter-api-client';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as conf from './config.json';
import { logger } from './helper.js';
import initScheduler from './scheduler.js';

// Twitter API ------

const twitterClient = new TwitterClient({
    apiKey : conf.default.twitterapi.apiKey,
    apiSecret : conf.default.twitterapi.apiSecret,
    accessToken : conf.default.twitterapi.accessToken,
    accessTokenSecret : conf.default.twitterapi.accessTokenSecret
});

// Aida Core Logic ------

const importCategory = (jsonPath) => {
    fs.readFileSync(__dirname + jsonPath, 'utf8', (err, data) => { // Must be synchronous, otherwise creates race conditions.
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
    logger.info(`Display config file contents: ${JSON.stringify(conf.default.aida)}${JSON.stringify(conf.default.calendar)}`);
    // TODO: Convert this into a dynamic for loop, pulling info from directory.
    importCategory('/categories/example.json');
    // importCategory('/categories/examp.json');
    // importCategory('/categories/self-promotion.json');
    // importCategory('/categories/tutorials.json');
    // importCategory('/categories/articles.json');
    initScheduler();
}

aidaInit();