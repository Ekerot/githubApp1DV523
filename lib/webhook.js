'use strict';

/**
 * Created by ekerot on 2016-12-30.
 */

const githubhook = new require('express-github-webhook');

let github = githubhook({
    host: "api.github.com",
    protocol: "https",
    path: "/hooks",
    secret: "hoppetisnoppeti"
});

module.exports = function() {

    github.on('*', function (event, repo, data) {
        console.log('hejhopp')
    });

    github.on('issues', function (repo, data) {
        console.log('hejhopp')
    });

    github.on('error', function (err, req, res) {
        console.log('err')
    });

};