'use script';

/**
 * Created by ekerot on 2016-12-20.
 */

const   express = require('express');
const   session = require('express-session');
const   hbs = require('express-handlebars');
const   bodyParser = require('body-parser');
const   path = require('path');
const   mongoose = require('./config/configDB.js');
const   websocket = require('./lib/websocket.js');

let GithubWebHook = new require('express-github-webhook');
let webhookHandler = GithubWebHook({ path: '/webhook', secret: 'secret' });

const   app = express();
const   port = process.env.PORT || 3000;

mongoose();
websocket();

app.set('view engine', 'handlebars');app.engine('handlebars', hbs({
    defaultLayout: 'layout',
    layoutDir: __dirname + '/views/layouts',
    partialsDir  : [__dirname + '/views/partials',]
}));

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/', require('./routes/main.js'));

app.use(webhookHandler); // use our middleware

// Now could handle following events
webhookHandler.on('*', function (event, repo, data) {

});

webhookHandler.on('issues', function (repo, data) {

});

webhookHandler.on('dekes03-examination-3', function (event, data) {
});

webhookHandler.on('error', function (err, req, res) {
});


//console what port that the app uses
app.listen(port, () => console.log(`Express app listening on port ${port}!`
    + '\nIf you want to terminate press ctrl+c'));

