


Set up a configured webhook ith this script:



    let github = new GitHubApi({
        // optional
        debug: true,
        protocol: "https",
        host: 'api.github.com', 
        headers: {
            "user-agent": "github-issue-handler" 
        },
        Promise: require('bluebird'),
        followRedirects: false, 
        timeout: 5000
    });

    github.authenticate({
        type: "oauth",
        token: process.env.AUTH_TOKEN
    });

    github.repos.createHook({
        "owner": "the_owner",
        "repo": "your_repo",
        "name": "web",
        "active": true,
        "events": [
            "push",
            "pull_request"
        ],
        "config": {
            "url": "www.example.se",
            "content_type": "json"
        }
    });
