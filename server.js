'use strict';

/**
 * Created by ekerot on 2016-12-20.
 */

const   express = require('express');
const   hbs = require('express-handlebars');
const   bodyParser = require('body-parser');
const   path = require('path');
const   GitHubWebHook = require('express-github-webhook');
const   webhookHandler = GitHubWebHook({path: '/webhook', secret: process.env.SECRET_TOKEN});
const   session = require('express-session');
const   uid = require('uid-safe');
const   slack = require('./libs/slack-bot');

const   app = express();
const   port = process.env.PORT || 3000;

//-------- set up session ---------------------

app.use(session({
    genid: uid(18, function (err, string) {
        if (err) throw err
        return string
    }),
    secret: "superDuperBestMunchiCookie",
    name: "wherethehellismysecretpasswordforgotitagain",
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 6000000
    }
}));

// ------- set up websocket -------------------

const   http = app.listen(port);
const   io = require('socket.io')(http);

// ---------configure template ----------------

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

io.on('connection',() => {
    console.log('LOGIN');
});

app.use(webhookHandler); // use middleware to get webhooks

webhookHandler.on('*',(event, repo, data) => {
    io.emit('webhook', data);
    slack(data);
});

webhookHandler.on('error',(err, req, res) => {
    console.log('err')
});

//routes

app.use('/', require('./routes/github.js'));

//-------------routing errors------------------

app.use((req, res) =>
    res.status(404).render('errors/404'));

app.use((err, req, res) =>
    res.status(400).render('errors/400'));

app.use((err, req, res) =>
    res.status(403).render('errors/401'));

app.use((err, req, res) =>
    res.status(500).render('errors/500'));

app.use((err, req, res) =>
    res.status(502).render('errors/500'));
