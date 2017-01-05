'use strict';

/**
 * Created by ekerot on 2016-12-20.
 */

const   express = require('express');
const   session = require('express-session');
const   hbs = require('express-handlebars');
const   bodyParser = require('body-parser');
const   path = require('path');
const   GitHubWebHook = require('express-github-webhook');
const   webhookHandler = GitHubWebHook({path: '/webhook', secret: process.env.SECRET_TOKEN});

const   app = express();
const   port = process.env.PORT || 3000;

// ------- set upp websocket --------------

const   http = app.listen(port);
const   io = require('socket.io')(http);

// ---------configure template ------------

app.set('view engine', 'handlebars');app.engine('handlebars', hbs({
    defaultLayout: 'layout',
    layoutDir: __dirname + '/views/layouts',
    partialsDir  : [__dirname + '/views/partials',]
}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- set up webhook fetcher ----------

io.on('connection', function(){
    console.log('LOGIN');
});

app.use(webhookHandler); // use middleware

webhookHandler.on('*', function (event, repo, data) {
    io.emit('webhook', data);
});

webhookHandler.on('error', function (err, req, res) {
    console.log('err')
});

//routes
app.use('/', require('./routes/main.js'));
app.use('/', require('./routes/login-github.js'));
