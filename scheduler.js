/**
 * Scheduler references imported cateogry documents, and will decide which tweets
 * should be implemented or placed in the staging area. The staging area is built
 * into the scheduler.
 */

import cron from 'node-cron';
import { format, endOfWeek, eachDayOfInterval, compareAsc, nextDay, startOfTomorrow, set} from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { logger, readFromConfig } from './helper.js';
import * as conf from './config.json';

const initScheduler = () => {
    let schedule = performScheduling(initCalendar());
    console.log(schedule);
}

const initCalendar = () => {
    const acceptedPostingPeriods = ["weekly", "daily", "monthly"];

    // We need the current date as the starting date, but modified with UTC offset and the starting time set to 00:00:00.
    let startingDate = new Date();
    // startingDate = new Date(set(new Date(startingDate.valueOf() - startingDate.getTimezoneOffset() * 60 * 1000), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0}));


    if (!readFromConfig(conf.default.aida.beginPostingToday)) {
        startingDate = startOfTomorrow();
    }

    let postingPeriod = readFromConfig(conf.default.calendar.postingPeriod);
    let lastPostDay = new Date();

    // TODO: Implement posting periods for daily or monthly posting.
    if (acceptedPostingPeriods.includes(postingPeriod)) {
        if (postingPeriod == "weekly") {
            logger.info("Posting period has been set to weekly.");
            lastPostDay = endOfWeek(startingDate); 
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
    
    calendar.availablePostDays = eachDayOfInterval(calendar.availablePostDaysInterval).map(x => set(x, { hours: 0 }));
    logger.debug(`Calendar data structure dump: ${JSON.stringify(calendar)}`);
    logger.info('Calendar has been configured and created!');

    return calendar;
}

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

const generatePreferredTimes = (day, useDefaultInterval = false) => {
    logger.debug(`Attempting to generate post time for ${day}...`);
    const getRandomRange = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const timeWithinRange = () => {
        let interval = { // Fallback interval
            "start" : "08:00",
            "end" : "06:00"
        };

        try {
            logger.debug(`Attempting to read ${format(day, 'i')} from ${JSON.stringify(readFromConfig(conf.default.calendar.preferredPostingInterval))}...`);
            interval = readFromConfig(conf.default.calendar.preferredPostingInterval[format(day, 'i')]);
        } catch {
            logger.debug(`Interval ${JSON.stringify(day)} is outside preferred posting interval. Using the posting interval fallback...`);
        } 

        return getRandomRange(interval.start.substring(0, 2), interval.end.substring(0, 2)); // Math library automatically converts strings into numbers!
    }

    return {
        hours: timeWithinRange(),
        minutes: Math.floor(Math.random() * 60),
        seconds: Math.floor(Math.random() * 60),
        milliseconds: 0
    };
}

const generatePreferredDate = (calendar) => {
    const rPrefDay = calendar.preferredPostingDays[Math.floor(Math.random() * calendar.preferredPostingDays.length)];
    const rAnyDay = calendar.availablePostDays[Math.floor(Math.random() * calendar.availablePostDays.length)];
    const nonPrefPostChance = readFromConfig(conf.default.calendar.nonPreferredPostChance);

    const r = Math.random();

    logger.debug(`Post chance: ${nonPrefPostChance}, Random value: ${r}, Post on preferred day(s)?: ${r > nonPrefPostChance ? true : false }`);
    logger.debug(`Random Chosen Pref Day: ${rPrefDay} | Random Chosen Any Day: ${rAnyDay}`);

    if (!calendar.preferredPostingDays.includes(rPrefDay)) {
        logger.warn(`Nope! ${rPrefDay} is not within ${calendar.availablePostDays}! Retrying!...`);
        generatePreferredDate(calendar);
    } else { 
        if (r > nonPrefPostChance) {
            const setDay = set(rPrefDay, generatePreferredTimes(rPrefDay));
            logger.debug(`Generated random day ${setDay} from preferredPostingDays{}.`);
            return setDay;
        } else {
            const setDay = set(rAnyDay, generatePreferredTimes(rAnyDay));
            logger.debug(`Generated random day ${rAnyDay} from availablePostingDays{}.`);
            return setDay;
        }
    }
}

// TODO: Fix issue with multiple posts being scheduled on one day. Keep count?
const performScheduling = (calendar) => {

    calendar.proposedPostList = [];
    let preferredPostingDays = [];

    // Only takes "weekly" posts into account at the moment. Will soon add daily and monthly options.
    for (let x in readFromConfig(conf.default.calendar.preferredPostingInterval)) {
        if (!calendar.availablePostDays.includes(nextDay(calendar.availablePostDaysInterval.start, x.toString()))) {
            preferredPostingDays.push(nextDay(calendar.availablePostDaysInterval.start, x.toString()));
        }
    }
    
    calendar.preferredPostingDays = preferredPostingDays;

    if (readFromConfig(conf.default.calendar.strictlyUsePreferredPostingInterval)) {
        // TODO: Only schedule posts during the preferred posting period specified in the config.
        // Untested --
        // for (let x = 0; x < readFromConfig(conf.default.calendar.postFrequency); x++) {
        //     const postingDate = generatePreferredDate(calendar);
        //     logger.debug(`Proposed date chosen from preferred posting intervals: ${postingDate}`);
        //     calendar.proposedPostList.push(postingDate);
        // }
    } else {
        for (let x = 0; x < readFromConfig(conf.default.calendar.postFrequency); x++) {
            // Can allow posts from outside specified posting period, though ultimately more rare.
            logger.debug('------ Generated Tweet Info -----------------------------------------------------------------');    

            const postingDate = generatePreferredDate(calendar);
            logger.debug(`Proposed date chosen from preferred posting intervals: ${postingDate}`);
            calendar.proposedPostList.push(postingDate);
        }
    }

    logger.info("Attempting to schedule posts...");
    logger.info("Analyzing best time to post to increase engagement odds...");

    calendar.proposedPostList.sort(compareAsc); // sort posts ascending
    return calendar;
}

export default initScheduler;