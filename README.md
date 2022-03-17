# Aida
Welcome!

Aida is an automated promotional Twitter bot designed to simulate human social media coordinators naturally without (currently) the use of neural networks. This bot is meant to be a logically designed alternative to automated scheduling/posting bots, and my attempt to understand 'paid' Twitter bot features various startups offer. As well, Aida is not designed to be a malicious bot or a social media sponge. Aida will not mass follow people, spam certain users or groups with automated replies, or tweet at inhuman speeds in the middle of the night.

This bot is designed to be used to foster growth and promote categorically-weighted content. Various improvements, features, and bug fixes will be introduced over the coming months as I continue to tweak Aida into the bot that I am designing it for. Below is a basis on the bot's technical abilities and features:

### Defining a category
A **category** is a collection of prepared tweets with various content or media that will be used by Aida to fill the calendar and schedule tweets throughout the designated time period stored within an easily editable JSON document. Your topics can be based on anything, but I recommend keeping related topics together in a single category to prevent random posts from invading your timeline if Aida has scheduled them differently.

#### Things Aida can do:

- Performs 'smart tweets', tweeting only during certain hours or days based on traffic data.
- Maintains human-like tweet frequency, will balance it's scheduled posts through a specific time period.
- Understands which category posts are doing well, will promote posts from those more heavily.
- Will show which tweets are scheduled before posting for final approval.
- Can automatically reply to direct messages with scripted responses. (If enabled manually)
- Understands which hashtags are best for outreach and will promote those within your category.

#### Things Aida will *not* do:

- Will not follow a massive number of random accounts.
- Does not aggressively tweet at all hours.
- Won't automatically repost previously posted material.
- Will not send unsolicited direct messages to random users or groups.
- Will not sporadically post all scheduled tweets in a single day.
- Wont manipulate engagement for temporary follows.

## Technicals

**config.example.js** should be configured appropriately and renamed to **config.js** to enable Twitter API communication. Aida will not start without this file!

*Libraries:*
[twitter-api-client](https://www.npmjs.com/package/twitter-api-client)

[node-cron](https://www.npmjs.com/package/node-cron)

[express](https://www.npmjs.com/package/express)

---

**Disclaimer**: This Twitter bot is being made personally in mind for my game studio's Twitter account, [@pugnplaystudios](https://twitter.com/pugnplaystudios), as a means for a solo developer and designer to accrue growth on social media without having to dedicate large swaths of time throughout the week to posting online. Instead, I can create content over the course of a couple of days, set Aida to begin scheduling, and it will begin monitoring for the best time tweet and promote my material borderline autonomously with little input for weeks. This repository serves as a learning/portfolio purpose and does not provide unlimited support for questions. If there are issues with core logic or deployment, please open the appropriate ticket.
