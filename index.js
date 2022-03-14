import { TwitterClient } from 'twitter-api-client';
import conf from './config.js'

const twitterClient = new TwitterClient({
    apiKey: conf.apiKey,
    apiSecret: conf.apiSecret,
    accessToken: conf.accessToken,
    accessTokenSecret: conf.accessTokenSecret
});

const data = await twitterClient.tweetsV2.createTweet({ "text" : "Theres something about making games..."});