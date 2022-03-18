/**
 * Scheduler references imported cateogry documents, and will decide which tweets
 * should be implemented or placed in the staging area. The staging area is built
 * into the scheduler.
 */

// !! Reading / Writing JSON using 'fs': https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js

import cron from 'node-cron';
import { format, endOfWeek, eachDayOfInterval} from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './helper.js';
import * as conf from './config.json';

// Sending Tweets using twitter-api-client.
// logger.info(`Got it! Sending tweet! 🤩 [Tweet contents: $_{data}]`);
// const data = await twitterClient.tweetsV2.createTweet({ "text" : "Theres something about making games..."});

const initScheduler = () => {
    let schedule = performScheduling(initCalendar());
    console.log(schedule);
}

const initCalendar = () => {
    /**
     * Gather information about the upcoming posting period.
     * Get current date to end of week. Weeks run from Sunday to Saturday. Adjust schedule.
     * Await request from Scheduler to attach tweet into calendar.
     */

    // TODO: Implement posting periods for daily or monthly posting.
    // Init posting configuration settings
    const acceptedPostingPeriods = ["weekly", "daily", "monthly"];

    let todaysDate = new Date();
    let postingPeriod = conf.default.calendar.postingPeriod;
    let lastPostDay = '';

    if (acceptedPostingPeriods.includes(postingPeriod)) {
        if (postingPeriod == "weekly") {
            logger.info("Posting period has been set to weekly.");
            lastPostDay = endOfWeek(todaysDate); // The last day in which tweets will get scheduled for the period.
            logger.info(`Last day of the posting period is (${lastPostDay}).`);
        }
    } else {
        throw new Error(`Calendar is unable to set posting period! postingPeriod within config.json must be either: ${JSON.stringify(acceptedPostingPeriods)}.`);
    }
    
    const calendar = {};

    // Return available dates that the scheduler can post on.
    calendar.availablePostDaysInterval = {
        start: todaysDate,
        end: lastPostDay
    };
    calendar.availablePostDays = eachDayOfInterval(calendar.availablePostDaysInterval);
    logger.debug(`Calendar data structure dump: ${JSON.stringify(calendar)}`);
    logger.info('Calendar has been configured and created!');

    return calendar;
}

const performScheduling = (calendarObj) => {
    /**
     * Analyze availablePostDays and determine which days will get what posts based on preferredPeriod [Interval?].
     * Once completed, begin to stage those posts on the calendar object.
     * Cron jobs should get assigned for each staged tweet.
     */

    // Example cron job. This will need to accept date-fns format at some point.
    // cron.schedule('*/2 * * * * *', () => {
    //     logger.info(uuidv4());
    // });

    logger.info("Attempting to schedule posts...");
    
    logger.info("Analyzing best time to post to increase engagement odds...");
    logger.debug("^ This must be configured manually.");

    return calendarObj;
}

export default initScheduler;