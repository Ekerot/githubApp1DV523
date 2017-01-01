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
const   port = process.env.PORT || 3030;

// ------- set upp websocket --------------

const   http = require('http').createServer(app);
const   io = new require('socket.io')(http);

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

app.use(webhookHandler); // use middleware

webhookHandler.on('*', function (event, repo, data) {
    io.on('connection', function(socket){
        socket.on('webhook',function (data){
            io.emit('webhook', data);
        });
    });
});


webhookHandler.on('error', function (err, req, res) {
    console.log('err')
});

http.listen(80, function(){
    console.log('Websocket is running bebe!')
});

//routes
app.use('/', require('./routes/main.js'));

//console what port that the app uses
app.listen(port, () => console.log(`Express app listening on port ${port}!`
    + '\nIf you want to terminate press ctrl+c'));

