/**
 * Scheduler references imported cateogry documents, and will decide which tweets
 * should be implemented or placed in the staging area. The staging area is built
 * into the scheduler.
 */

// !! Reading / Writing JSON using 'fs': https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js

import cron from 'node-cron';
import { endOfWeek, eachDayOfInterval, nextDay, toDate, startOfTomorrow, set} from 'date-fns';
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

    // Init posting configuration settings
    const acceptedPostingPeriods = ["weekly", "daily", "monthly"];

    // We need the current date as the starting date, but modified with UTC offset and the starting time set to 00:00:00.
    let startingDate = new Date();
    startingDate = set(new Date(startingDate.valueOf() - startingDate.getTimezoneOffset() * 60 * 1000), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0});


    if (!conf.default.aida.beginPostingToday) {
        startingDate = startOfTomorrow();
    }

    let postingPeriod = conf.default.calendar.postingPeriod;
    let lastPostDay = '';

    // TODO: Implement posting periods for daily or monthly posting.
    if (acceptedPostingPeriods.includes(postingPeriod)) {
        if (postingPeriod == "weekly") {
            logger.info("Posting period has been set to weekly.");
            lastPostDay = endOfWeek(startingDate); // The last day in which tweets will get scheduled for the period.
            logger.info(`Last day of the posting period is (${lastPostDay}).`);
        }
    } else {
        throw new Error(`Calendar is unable to set posting period! postingPeriod within config.json must be either: ${JSON.stringify(acceptedPostingPeriods)}.`);
    }
    
    const calendar = {};

    calendar.availablePostDaysInterval = {
        start: startingDate,
        end: lastPostDay
    };
    calendar.availablePostDays = eachDayOfInterval(calendar.availablePostDaysInterval);
    logger.debug(`Calendar data structure dump: ${JSON.stringify(calendar)}`);
    logger.info('Calendar has been configured and created!');

    return calendar;
}

// TODO: Implement logic to only post during 'normal' hours, not during middle of night or after too long.
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

    calendarObj.postList = '';

    let intervalSpan = {};
    // Only takes "weekly" posts into account at the moment. Will soon add daily and monthly options.
    for (let x in conf.default.calendar.preferredPostingInterval) {
        intervalSpan[x] = nextDay(calendarObj.availablePostDaysInterval.start, x.toString());
    }
    calendarObj.intervalSpan = intervalSpan;

    if (conf.default.calendar.strictlyUsePreferredPostingInterval) {
        // Only schedule posts during the preferred posting period specified in the config.

    } else {
        for (let x = 0; x < conf.default.calendar.postFrequency; x++) {
            // Can allow posts from outside specified posting period, though ultimately more rare.
            const nonPrefPostChance = conf.default.calendar.nonPreferredPostChance;
            const r = Math.random();
            logger.debug(`post chance: ${nonPrefPostChance}, random: ${r}, post on preferred day(s)?: ${r > nonPrefPostChance ? true : false }`);
            if (r > nonPrefPostChance) {
                // Post on a day thats IN the preferred posting periods.

                //  Complete these:
                /**
                 *  Pick a random day from calendar.availablePostDays, compare it to see if its included in the preferred days. (availablePostdays.include(pickedDate));
                 *  If so, pick that day, if not, try again. (Maybe should be seperate method that is recalled?)
                 * 
                 *  Repeat for strictlyUsePreferredPostingInterval ^, but don't use recalling method.
                 * 
                 *  Once a day has been picked, randomly pick a time from within a 24-hour period. Compare it with perferredPostingInterval.
                 *  If the time is within the preferredPostingInterval range, add it to the postList, if not retry.
                 * 
                 *  (Is there a better way to this?)
                 */
            } else {
                // Post on non-preferred days.
            }      
        }
    }

    logger.info("Attempting to schedule posts...");
    logger.info("Analyzing best time to post to increase engagement odds...");

    return calendarObj;
}

export default initScheduler;