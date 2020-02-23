"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Twitter = require("node-twitter-api");
const request = require("request");
const env = require('../config/env');
exports.twitterSignIn = (req, res) => {
    let twitter = new Twitter({
        consumerKey: process.env.twitterConsumerKey,
        consumerSecret: process.env.twitterConsumerSecret,
        callback: process.env.twitterCallback,
    });
    let _requestSecret;
    twitter.getRequestToken(function (err, requestToken, requestSecret) {
        if (err)
            res.status(500).send(err);
        else {
            _requestSecret = requestSecret;
            res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
        }
    });
};
exports.twitterToken = (req, res) => {
    request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
            oauth_callback: process.env.twitterCallback,
            consumer_key: process.env.twitterConsumerKey,
            consumer_secret: process.env.twitterConsumerSecret
        }
    }, function (err, r, body) {
        if (err) {
            return res.send(500, { message: err.message });
        }
        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
    });
};
//# sourceMappingURL=passport.js.map