
/**
 * Created by ekerot on 2016-12-20.
 */

const router = require('express').Router();
const GitHubApi = require("github");

router.route('/')  //function just to show first page
    .get(function(req, response) {

        let AUTH_TOKEN = '3f8b8e2fc8e148eeadf337c248ec71709fe5244e';

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
            token: AUTH_TOKEN
        });

        github.issues.getForRepo({owner: '1dv523', repo: 'dekes03-examination-3'}, function (err, res) {

            let jsonObject = res;

            let issues = {            //creating context variable to send to view

                issues: jsonObject.map(function (issues) {
                    return {
                        title: issues.title,
                        id: issues.id,
                        body: issues.body,
                        comments: issues.comments,
                        created_at: issues.created_at,
                        html_url: issues.html_url,
                        login: issues.user.login,
                        avatar_url: issues.user.avatar_url,
                    }
                })
            };

            console.log(issues)
            response.render('main/index', issues)
        });
    });

module.exports = router;
