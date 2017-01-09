'use strict';

/**
 * Created by ekerot on 2017-01-09.
 */

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
module.exports = (req, res, repo) => {
    let transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');


// setup e-mail data with unicode symbols
    let mailOptions = {
        from: '"GitHub Issue Handler " <daniel@ekerot.se>', // sender address
        to: req.nav.email, // list of receivers
        subject: 'Notification', // Subject line
        text: 'A issue have been created/ closed or modified by' + req.issues.login + 'at repository ' + repo,
        html: '<b>Hello world 🐴</b>' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions,(error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};