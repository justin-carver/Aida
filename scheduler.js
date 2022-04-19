import schedule from 'node-schedule';
import { TwitterClient } from 'twitter-api-client';
import { format, endOfWeek, endOfDay, compareAsc, eachDayOfInterval, nextDay, startOfTomorrow, set } from 'date-fns';
import { logger, readFromConfig, categoryObj} from './helper.js';
import ShortUniqueId from 'short-unique-id';
import * as conf from './config.json' assert {type: 'json'};

const twitterClient = new TwitterClient({
    apiKey : readFromConfig(conf.default.twitterapi.apiKey),
    apiSecret : readFromConfig(conf.default.twitterapi.apiSecret),
    accessToken : readFromConfig(conf.default.twitterapi.accessToken),
    accessTokenSecret : readFromConfig(conf.default.twitterapi.accessTokenSecret)
});

let postedTweets = [];
const uid = new ShortUniqueId({ length: 10 });

const isTweetTaken = (tweet) => { return postedTweets.includes(tweet); }

const generateTweet = (categories, calendar) => {
    let randomCategory = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
    const randomTweet = categories[randomCategory]['tweets'][Math.floor(Math.random() * Object.keys(categories[randomCategory]['tweets']).length)];

    // TODO: Fix / Catch issue with post frequency being larger than imported category tweets causing stack overflow error.
    if (readFromConfig(conf.default.aida.enableReposts) == true) {
        calendar.listOfTweets.push(Object.assign({uid : uid()}, randomTweet));
    } else {
        if (!isTweetTaken(randomTweet.text)) {
            logger.debug('------ Generated Tweet Information --------------------------------------------------------------');
            logger.info(`Choosing a random tweet from: ${randomCategory}.`);
            logger.info(`Picking random tweet!: ${JSON.stringify(randomTweet)}`);
            const postingDate = generatePreferredDate(calendar);

            logger.debug(`Proposed posting date chosen from preferred posting intervals: ${postingDate}`);
            calendar.proposedPostList.push(postingDate);
            logger.debug('Finding the right tweet to post...');

            postedTweets.push(randomTweet.text);
            calendar.listOfTweets.push(Object.assign({uid : uid()}, randomTweet));
        } else {
            if (postedTweets.length < readFromConfig(conf.default.calendar.postFrequency)) {
                generateTweet(categories, calendar);
            }
        }
    }
}

const postTweet = async (tweets) => {
    try {
        await twitterClient.tweetsV2.createTweet({ "text" : tweets[0].text }).then(() => {
            logger.info(`Success! The following tweet has been posted! ☑️ "${tweets[0].text}"`);
            tweets.shift(); // Remove first tweet.
        });
    } catch (e) {
        throw new Error(`Failed to post tweet! | ${e}`);
    }
}

const runCronJobs = (scheduleInfo) => {
    try {
        scheduleInfo.proposedPostList.forEach((postDate, index) => {
            logger.info(`Scheduling tweet for ${format(postDate, 'PPPPpppp')}! Tweet info below.`);
            logger.info(`➡️ ${JSON.stringify(scheduleInfo.listOfTweets[index].text)}`)
            schedule.scheduleJob(postDate, () => {
                postTweet(scheduleInfo.listOfTweets);
                logger.debug('Post has been posted! On Twitter!');
            });
        });
    } catch (e) {
        throw new Error(`Error attempting to schedule tweet using proposedPostList! | ${e}`);
    }
}

const initScheduler = () => {
    postedTweets = [];
    logger.info('Creating the posting schedule and initializing the calendar...');
    let schedule = performScheduling(initCalendar());
    console.log(schedule);
    logger.info('Beginning scheduling! Prepping cron jobs...');
    runCronJobs(schedule);
}

const initCalendar = () => {
    logger.debug('Calendar init, loading startup config...');
    const acceptedPostingPeriods = ["weekly", "daily", "monthly"];

    let startingDate = set(new Date(), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0});
    logger.info(`Starting post date set to: ${startingDate}`);

    if (!readFromConfig(conf.default.aida.beginPostingToday)) {
        logger.info(`Posts will actually start getting scheduled tomorrow: ${startOfTomorrow()}`);
        startingDate = set(startOfTomorrow(), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0});
        console.log(startingDate);
    }

    let postingPeriod = readFromConfig(conf.default.calendar.postingPeriod);
    let lastPostDay = new Date();

    // TODO: Implement posting periods for monthly posting.
    if (acceptedPostingPeriods.includes(postingPeriod)) {
        switch (postingPeriod) {
            case "weekly":
                logger.info("Posting period has been set to weekly.");
                lastPostDay = set(endOfWeek(startingDate), {hours: 23, minutes: 59, seconds: 59, milliseconds: 999}); 
                logger.info(`Last day of the posting period is (${lastPostDay}).`);
            break;
            case "daily":
                logger.info("Posting period has been set to daily.");
                lastPostDay = endOfDay(startingDate);
                logger.info(`Last day of the posting period is (${lastPostDay}).`);
            break;
            default:
                lastPostDay = endOfWeek(startingDate); // default weekly
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
    calendar.listOfTweets = [];

    logger.debug(`Calendar data structure dump: ${JSON.stringify(calendar)}`);
    logger.info('Calendar has been configured and created!');

    return calendar;
}

const generatePreferredTimes = (day) => {
    logger.debug(`Attempting to generate post time for ${format(day, 'PPPP')}...`);

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
            logger.debug(`Attempting to read posting interval for day ${format(day, 'i')} from ${JSON.stringify(readFromConfig(conf.default.calendar.preferredPostingInterval))}...`);
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
    const nonPrefPostChance = readFromConfig(conf.default.calendar.nonPreferredPostChance);
    const r = Math.random();

    logger.debug(`Post chance: ${nonPrefPostChance}, Random value: ${r}, Post on preferred day(s)?: ${r > nonPrefPostChance ? true : false }`);

    let rAnyDay, setDay, rPrefDay = new Date();

    switch (readFromConfig(conf.default.calendar.postingPeriod)) {
        case "daily":
            rPrefDay = calendar.preferredPostingDays[0];
            break;
        default:
            rPrefDay = calendar.preferredPostingDays[Math.floor(Math.random() * calendar.preferredPostingDays.length)];
    }

    if (!calendar.preferredPostingDays.includes(rPrefDay)) {
        logger.warn(`Nope! ${format(rPrefDay, 'PPPP')} is not within ${calendar.availablePostDays}! Retrying!...`);
        generatePreferredDate(calendar);
    } else { 
        if (!readFromConfig(conf.default.calendar.strictlyUsePreferredPostingInterval)) {
            if (r > nonPrefPostChance) {
                setDay = set(rPrefDay, generatePreferredTimes(rPrefDay));
                logger.info(`Selected new posting date (pref): ${format(setDay, 'PPPPpppp')}, generated from preferredPostingDays{}.`);
                return setDay;
            } else {
                rAnyDay = calendar.availablePostDays[Math.floor(Math.random() * calendar.availablePostDays.length)];
                setDay = set(rAnyDay, generatePreferredTimes(rAnyDay));
                logger.info(`Selected new posting date (any): ${format(setDay, 'PPPPpppp')} from availablePostingDays{}.`);
                return setDay;
            }
        } else {
            setDay = set(rPrefDay, generatePreferredTimes(rPrefDay));
            logger.info(`Selected new posting date (pref): ${format(setDay, 'PPPPpppp')}, generated from preferredPostingDays{}.`);
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

    let freq = readFromConfig(conf.default.calendar.postFrequency);
    logger.info(`Generating ${freq} tweets!`);
    for (let x = 0; x < freq; x++) { 
        generateTweet(categoryObj, calendar);
    }

    logger.info("Analyzing best time to post to increase engagement odds...");

    calendar.proposedPostList = [
        new Date('2022-04-19T02:30:00Z'),
        new Date('2022-04-19T02:34:00Z'),
        new Date('2022-04-19T02:41:00Z'),
    ];
    calendar.proposedPostList.sort(compareAsc);
    return calendar;
}

export default initScheduler;