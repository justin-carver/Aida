# Aida
Welcome!

Aida is a light-weight, autonomous promotional Twitter bot designed to simulate human social media coordinators naturally without (currently) the use of neural networks. This bot is meant to be a logically designed alternative to automated scheduling/posting bots that blindly post, and my attempt to understand 'paid' Twitter bot features various startups offer. As well, Aida is designed to not be a malicious bot or a social media sponge. Aida will not mass follow people, spam certain users or groups with automated replies, or tweet at inhuman speeds in the middle of the night.

This bot is designed to be used to foster online business growth and promote content based on preferred posting periods. Various improvements, features, and bug fixes will be introduced over the coming months as I continue to tweak Aida into the bot that I am designing it for. Below is a basis on the bot's technical abilities and features:

### Defining a category
A **category** is a collection of prepared tweets with various content or media that will be used by Aida to fill the calendar and schedule tweets throughout the designated time period stored within an easily editable JSON document. Your topics can be based on anything, but I recommend keeping related topics together in a single category to prevent random posts from invading your timeline if Aida has scheduled them differently.

Aida will **not** automatically generate content for you. This is simply a way to distribute large amounts of pre-configured content on a preferred schedule in a smart and easy way. Studies show that social media engagement rates are focused around certain intervals of time throughout the day: morning commute, lunch time, the drive home, etc. Aida will listen to your preferred posting periods within your `config.json` and schedule tweets only around your specified time intervals. This allows marketing to understand the business' KPIs/CTRs and always post content when people want to engage with it most, leading to positive organic growth.

#### Things Aida can do:

- Performs 'smart tweets', tweeting only during certain hours or days based on traffic data.
- Pool from various categories of tweets to cover various areas of interest.
- Maintains human-like tweet frequency, will balance it's scheduled posts through a configured specific time period.
- Will show which tweets are scheduled before posting for final approval, which allows undoing.
- *[Soon!] Understands which category posts are doing well, will promote posts from those more heavily.*
- *[Soon!] Can automatically reply to direct messages with scripted responses. (If enabled manually beforehand)*
- *[Soon!] Understands which hashtags are best for outreach and will promote those within your category.*

#### Things Aida will *not* do:

- Will not follow a massive number of random accounts or "boosting".
- Does not aggressively tweet at all hours of the day like a spambot.
- Will not send unsolicited direct messages to random users or groups.
- Will not sporadically post all scheduled tweets in a single day.

## How to Use

1. Fork this repo or clone it onto your machine.
2. Verify that the `config.json` has been created and configured using the resource below.
3. Run `npm i` to install all dependencies.
4. Run `npm start`.
5. Aida will take care of the rest!

## Technicals

Verify that `config.json` is generated using the details below to enable Twitter API communication. Aida will not start without this file!

When configuring the appropriate `preferredPostingInterval` please adhere to [date-fns's](https://date-fns.org/v2.28.0/docs/format) documentation for ISO integer date formating, Sunday to Saturday:
| Preferred Day | ISO Formatting |
| :--- | :--- |
| Sun, Mon, Tues, Wed, Thurs, Fri, Sat | '0', '1', '2', '3', '4', '5', '6', '7' |
`start` and `end` times within the `preferredPostingInterval` are running on a 24-hour format. (e.g. 16:00) Single-digit hours must be prefaced with a zero. (e.g. 04:00)

### Config Template
You will need a specified `config.json` file available in the same directory that Aida is located in.
```
{
    "aida" : {
        "categoryDirectory" : "categories",
        "logLevel" : "debug",
        "logOutputAsJson" : false,
        "beginPostingToday" : true,
        "requireFinalApproval" : false
    },
    "calendar" : {
        "timezone" : "America/Chicago",
        "postingPeriod" : "weekly",
        "postFrequency" : 10,
        "nonPreferredPostChance" : 0.10,
        "strictlyUsePreferredPostingInterval" : false,
        "preferredPostingInterval" : {
            "2" : {
                "start" : "09:00",
                "end" : "11:00"
            },
        }
    },
    "twitterapi" : {
        "apiKey" : "",
        "apiSecret" : "",
        "accessToken" : "",
        "accessTokenSecret" : "",
        "clientId" : "",
        "clientSecret" : "",
        "bearer_token" : ""
    }
}
```

### Config Descriptors
| config item | type | description | flags |
|:---|:---|:---|:---|
| `categoryDirectory` | *string* | The *relative* path to the folder containing the category JSON files. | `"directory_name"`
| `logLevel` | *string* | Configures the displayed log level that is output to the console and to log files. | `"info"`, `"debug"`, `"warn"`, `"error"`
| `logOutputAsJson` | *boolean* | Will display terminal friendly log ouput if false, will output logs strictly as JSON objects if true. | `true`, `false`
| `beginPostingToday` | *boolean* | If true, Scheduler will generate preferred posting times with the current day included. | `true`, `false`
| `requireFinalApproval` | *boolean* | **(Not Implemented)** If true, Aida will require human input for approving the final post list. | `true`, `false`

*Libraries:*

[twitter-api-client](https://www.npmjs.com/package/twitter-api-client)

[node-schedule](https://www.npmjs.com/package/node-schedule)

[date-fns](https://www.npmjs.com/package/date-fns)

[uuid](https://www.npmjs.com/package/uuid)

## TODO

These are various ideas that I would love to implement with Aida at some point:

- [ ] Implement metric reporting locally on the server via Aida.
- [ ] Once Aida has finished the posting period, generate a new one and restart if applicable.
- [ ] Implement category weights to allow Aida to pull more posts from certain categories.
- [ ] Be able to reply to simple direct messages or replies using scripted responses.
- [ ] Tweet using a collection of hashtags for various categories.
- [ ] Allow basic retweeting or liking of tweets, based on hashtag data.

---

**Disclaimer**: This Twitter bot is being made personally in mind for my game studio's Twitter account, [@pugnplaystudios](https://twitter.com/pugnplaystudios), as a means for a solo developer and designer to accrue growth on social media without having to dedicate large swaths of time throughout the week to posting online. Instead, I can create content over the course of a couple of days, set Aida to begin scheduling, and it will begin monitoring for the best time tweet and promote my material borderline autonomously with little input for weeks. This repository serves as a learning/portfolio purpose and does not provide unlimited support for questions. If there are issues with core logic or deployment, please open the appropriate ticket.
