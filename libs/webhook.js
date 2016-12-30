'use strict';

/**
 * Created by ekerot on 2016-12-30.
 */

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

rp(options)
    .then(function(result) {
        if (error) throw new Error(error);

        console.log(body);

    })
    .catch(function(err){

        console.log(err);

    });