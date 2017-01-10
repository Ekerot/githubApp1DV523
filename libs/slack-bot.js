'use strict';

/**
 * Created by ekerot on 2017-01-10.
 */

const WebClient = require('@slack/client').WebClient;

let token = process.env.SLACK_API_TOKEN || ''; //see section above on sensitive data

let web = new WebClient(token);


module.exports = (data) => web.chat.postMessage('C1232456', 'Hello there',(err, res) => {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', res);
    }
});