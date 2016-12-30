
/**
 * Created by ekerot on 2016-12-20.
 */

const router = require('express').Router();
const GitHubApi = require("github");

router.route('/')  //function just to show first page
    .get(function(req, response) {

        let token = process.env.AUTH_TOKEN;

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
            token: token
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
            response.render('main/index', issues)
        });

        let rp = require("request-promise");

        let options = { method: 'POST',
            url: 'https://api.github.com/repos/1dv523/dekes03-examination-3/hooks',
            headers:
                {
                    "name": "issues",
                    "active": true,
                    "events": [
                        "issues",
                        "issue_comment"
                    ],
                    "config": {
                        "url": "https://www.ekerot.se",
                        "content_type": "json"
                    }
                },
            authorization: 'Token 3f8b8e2fc8e148eeadf337c248ec71709fe5244e'} ;

        rp(options).then(function(result) {

                console.log(result);

            })
            .catch(function(err){

                console.log(err);

            });

    });

module.exports = router;
