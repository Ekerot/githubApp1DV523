'use strict';

/**
 * Created by ekerot on 2016-12-30.
 */

const GitHubApi = require("github");

module.exports = function () {

    let github = new GitHubApi({
        // optional
        debug: true,
        protocol: "https",
        host: 'api.github.com', // should be api.github.com for GitHub
        headers: {
            "user-agent": "github-issue-handler" // GitHub is happy with a unique user agent
        },
        Promise: require('bluebird'),
        followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
        timeout: 5000
    });

    github.authenticate({
        type: "oauth",
        token: process.env.AUTH_TOKEN
    });

    github.repos.createHook({
        "owner": "1dv523",
        "repo": "dekes03-examination-3",
        "name": "web",
        "active": true,
        "events": [
            "push",
            "pull_request"
        ],
        "config": {
            "url": "localhost:3000/webhook",
            "content_type": "json"
        }
    });
};