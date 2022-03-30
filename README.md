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

## Technicals

`config.example.json` should be configured appropriately and renamed to `config.json` to enable Twitter API communication. Aida will not start without this file!

When configuring the appropriate `preferredPostingInterval` please adhere to [date-fns's](https://date-fns.org/v2.28.0/docs/format) documentation for ISO integer date formating, Sunday to Saturday:
| Preferred Day | ISO Formatting |
| --- | --- |
| Sun, Mon, Tues, Wed, Thurs, Fri, Sat | '0', '1', '2', '3', '4', '5', '6', '7' |

*Libraries:*

[twitter-api-client](https://www.npmjs.com/package/twitter-api-client)

[node-cron](https://www.npmjs.com/package/node-cron)

[express](https://www.npmjs.com/package/express)

## Wishlist

These are various ideas that I would love to implement with Aida at some point:

- [ ] Implement metric reporting locally on the server via Aida. Currently, users have to manage their own growth metrics.

---

**Disclaimer**: This Twitter bot is being made personally in mind for my game studio's Twitter account, [@pugnplaystudios](https://twitter.com/pugnplaystudios), as a means for a solo developer and designer to accrue growth on social media without having to dedicate large swaths of time throughout the week to posting online. Instead, I can create content over the course of a couple of days, set Aida to begin scheduling, and it will begin monitoring for the best time tweet and promote my material borderline autonomously with little input for weeks. This repository serves as a learning/portfolio purpose and does not provide unlimited support for questions. If there are issues with core logic or deployment, please open the appropriate ticket.
