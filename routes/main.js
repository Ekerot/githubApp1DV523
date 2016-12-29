
/**
 * Created by ekerot on 2016-12-20.
 */

const router = require('express').Router();
const rp = require('request-promise');

router.route('/')  //function just to show first page

    .get(function(req, res) {

        let token = 'c75298558c9f04ebed2fed3fb5b87040666b4768';

        let options = {
            uri: 'https://api.github.com/repos/1dv523/dekes03-examination-3/issues',
            qs: {
                client_id: 'Ekerot',
                access_token: token
            },
            headers: {
                'User-Agent': 'daniel.ekerot@gmail.com'
            },
            json: true // Automatically parses the JSON string in the response
        };

        console.log(options);

        rp(options)
            .then(function (repos) {
                console.log('User has %d repos', repos);
            })
            .catch(function (err) {
                // API call failed...
            });

        res.render('main/index')
    });

module.exports = router;
