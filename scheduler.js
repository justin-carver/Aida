/**
 * Scheduler references imported cateogry documents, and will decide which tweets
 * should be implemented or placed in the staging area. The staging area is built
 * into the scheduler.
 */

import cron from 'node-cron';
import { logger } from './helper.js';

// Sending Tweets using twitter-api-client.
// logger.info(`Got it! Sending tweet! 🤩 [Tweet contents: $_{data}]`);
// const data = await twitterClient.tweetsV2.createTweet({ "text" : "Theres something about making games..."});

const initScheduler = () => {
    cron.schedule('*/2 * * * * *', () => {
        logger.info('2 seconds?');
    });
}

export default initScheduler;