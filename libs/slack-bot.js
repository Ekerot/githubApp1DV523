'use strict';

/**
 * Created by ekerot on 2017-01-10.
 */

//function will post messages every time an issue in a repository is changed in any way

const WebClient = require('@slack/client').WebClient;

let token = process.env.SLACK_API_TOKEN;

let web = new WebClient(token);

module.exports = (data) => {   //this function sends the message always use first the chanel and second the message
    web.chat.postMessage('test', 'The user ' + data.issue.user.login + ' has '
        + data.action  + ' the issue ' + data.issue.title + ' at the repository '
        + data.repository.name, (err, res) => {

        if (err) {
            console.log('Error:', err);
        } else {
            console.log('Message sent: ', res);
        }
    });
};