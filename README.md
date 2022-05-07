# Aida

![Twitter](https://img.shields.io/badge/Autonomous_Twitter_Bot-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)

[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)

Welcome! _Meet your new Social Media Manager: Aida._

Aida is a light-weight, autonomous promotional Twitter bot designed to simulate humans naturally on social media. This bot is meant to be a logically designed alternative to automated scheduling/posting bots that blindly post, and my attempt to understand 'paid' Twitter bot features various startups offer. As well, Aida is designed to not be a malicious bot or a social media sponge. Aida will not mass follow people, spam certain users or groups with automated replies, or tweet at inhuman speeds in the middle of the night.

This bot is designed to be used to foster online business growth and promote content based on preferred posting periods. Various improvements, features, and bug fixes will be introduced over the coming months as I continue to tweak Aida into the bot that I am designing it for. Below is a basis on the bot's technical abilities and features:

### Defining a category

A **category** is a collection of prepared tweets with various content or media that will be used by Aida to fill the calendar and schedule tweets throughout the designated time period stored within an easily editable JSON document. Your topics can be based on anything you'd like to tweet about, but I recommend keeping related topics together in a single category to prevent random posts from invading your content calendar if Aida has scheduled them differently.

Aida will **not** automatically generate content for you. This is simply a way to distribute large amounts of pre-generated content on a preferred schedule in a smart and easy way. Studies show that social media engagement rates are focused around certain intervals of time throughout the day: morning commute, lunch time, the drive home, etc. Aida will listen to your preferred posting periods within your `config.json` and schedule tweets only around your specified time intervals. This allows marketing to understand the business' KPIs/CTRs and always post content when people want to engage with it most, leading to positive organic growth.

#### Things Aida can do:

-   Performs 'smart tweets', tweeting only during certain hours or days based on traffic data.
-   Pool from various categories of tweets to cover various areas of interest.
-   Maintains human-like tweet frequency, will balance it's scheduled posts through a configured specific time period.
-   Will show which tweets are scheduled before posting for final approval, which allows undoing.
-   _[Soon!] Understands which category posts are doing well, will promote posts from those more heavily._
-   _[Soon!] Can automatically reply to direct messages with scripted responses. (If enabled manually beforehand)_
-   _[Soon!] Understands which hashtags are best for outreach and will promote those within your category._

#### Things Aida will _not_ do:

-   Will not follow a massive number of random accounts or "boosting".
-   Does not aggressively tweet at all hours of the day like a spambot.
-   Will not send unsolicited direct messages to random users or groups.
-   Will not sporadically post all scheduled tweets in a single day.

## How to Use

1. Fork this repo or clone it onto your machine.
2. Verify that the `config.json` has been created and configured using the resource below.
3. Run `npm i` to install all dependencies.
4. Run `npm start`.
5. Aida will take care of the rest!

## Technicals

Verify that `config.json` is generated using the details below to enable Twitter API communication. Aida will not start without this file!

If you are receiving a `{ uid: 'void', text: '' }` object within listOfTweets when attempting to post, this means that the post frequency is more than the total amount of written unique tweets. This can be disabled with the `enableReposts: true`. This is done with a simple string comparative operator, nothing fancy.

When using `readFromConfig(structurePath)` to add/read from the `config.json` you must use: `conf.default.[structureQuery]` in order to pull accurate information from the configuration file's JSON data structure. (e.g. `conf.default.calendar.postingPeriod`) Anything else may result in errors when launching.

When configuring the appropriate `preferredPostingInterval` please adhere to [date-fns's](https://date-fns.org/v2.28.0/docs/format) documentation for ISO weekday integer date formating, Monday to Sunday:
| Preferred Day | ISO Formatting |
| :--- | :--- |
| Mon, Tues, Wed, Thurs, Fri, Sat, Sun | '1', '2', '3', '4', '5', '6', '7' |

`start` and `end` times within the `preferredPostingInterval` are running on a 24-hour format. (e.g. 16:00) Single-digit hours must be prefaced with a zero. (e.g. 04:00)

If `postingPeriod` is set to `"daily"`, only the first element of the `preferredPostingInterval` array will be used.

### Config Template

You will need a specified `config.json` file available in the same directory that Aida is located in.

```json
{
    "aida": {
        "categoryDirectory": "categories",
        "logLevel": "debug",
        "logOutputAsJson": false,
        "beginPostingToday": true,
        "enableReposts": false,
        "requireFinalApproval": false
    },
    "calendar": {
        "postingPeriod": "weekly",
        "postFrequency": 10,
        "nonPreferredPostChance": 0.1,
        "strictlyUsePreferredPostingInterval": false,
        "preferredPostingInterval": {
            "2": {
                "start": "09:00",
                "end": "11:00"
            }
        }
    },
    "twitterapi": {
        "apiKey": "",
        "apiSecret": "",
        "accessToken": "",
        "accessTokenSecret": ""
    }
}
```

### Config Descriptors

| Config Item            | Type      | Description                                                                                           | Flags                                    |
| :--------------------- | :-------- | :---------------------------------------------------------------------------------------------------- | :--------------------------------------- |
| **Aida**               |
| `categoryDirectory`    | _string_  | The _relative_ path to the folder containing the category JSON files.                                 | `"directory_name"`                       |
| `logLevel`             | _string_  | Configures the displayed log level that is output to the console and to log files.                    | `"info"`, `"debug"`, `"warn"`, `"error"` |
| `logOutputAsJson`      | _boolean_ | Will display terminal friendly log ouput if false, will output logs strictly as JSON objects if true. | `true`, `false`                          |
| `beginPostingToday`    | _boolean_ | If true, Scheduler will generate preferred posting times with the current day included.               | `true`, `false`                          |
| `enableReposts`        | _boolean_ | If true, Aida will **not** determine whether the tweet has been posted already.                       | `true`, `false`                          |
| `requireFinalApproval` | _boolean_ | If true, Aida will require human input for approving the final post list.                             | `true`, `false`                          |
| **Calendar**           |
| `postingPeriod`        | _string_  | Specifies how often the scheduler will generate new content calendars.                                | `"daily"`, `"weekly"`,                   |

_Libraries:_

[twitter-api-client](https://www.npmjs.com/package/twitter-api-client)

[node-schedule](https://www.npmjs.com/package/node-schedule)

[date-fns](https://www.npmjs.com/package/date-fns)

## TODO

These are various ideas that I would love to implement with Aida at some point:

-   [ ] Allow users to customize their own timezones. Currently only works with systems timezone.
-   [ ] Implement metric reporting locally on the server via Aida.
-   [ ] Once Aida has finished the posting period, generate a new one and restart if applicable.
-   [ ] Implement category weights to allow Aida to pull more posts from certain categories.
-   [ ] Be able to reply to simple direct messages or replies using scripted responses.
-   [ ] Tweet using a collection of hashtags for various categories.
-   [ ] Allow basic retweeting or liking of tweets, based on hashtag data.

---

If you made it this far, [hire me!](https://linkedin.com/in/justin-carver)

If you're currently using Aida for your business, consider [buying me a coffee!](https://ko-fi.com/justincarver) I'd love to continue to support Aida with new features.

## [![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/justincarver)

**Disclaimer**: This Twitter bot is being made personally in mind for my game studio's Twitter account, [@pugnplaystudios](https://twitter.com/pugnplaystudios), as a means for a solo developer and designer to accrue growth on social media without having to dedicate large swaths of time throughout the week to posting online. Instead, I can create content over the course of a couple of days, set Aida to begin scheduling, and it will begin monitoring for the best time tweet and promote my material borderline autonomously with little input for weeks. This repository serves as a learning/portfolio purpose and does not provide unlimited support for questions. If there are issues with core logic or deployment, please open the appropriate ticket.
