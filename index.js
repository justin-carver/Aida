import fs from 'fs';
import { TwitterClient } from 'twitter-api-client';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import conf from './config.js'
import winston from 'winston';

// Logger ------

// TODO: Fix/Update transports to log accurate levels and info to the all necessary log files below.
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error'}),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Twitter API ------

const twitterClient = new TwitterClient({
    apiKey: conf.apiKey,
    apiSecret: conf.apiSecret,
    accessToken: conf.accessToken,
    accessTokenSecret: conf.accessTokenSecret
});

// logger.info(`Got it! Sending tweet! 🤩 [Tweet contents: $_{data}]`);
// How to do
// const data = await twitterClient.tweetsV2.createTweet({ "text" : "Theres something about making games..."});

// Aida Core Logic ------

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
}

aidaInit();