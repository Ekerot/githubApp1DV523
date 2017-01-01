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
const   GitHubWebHook = new require('express-github-webhook');
const   webhookHandler = GitHubWebHook({path: "/hooks", secret: "hoppetisnoppeti"});

const   app = express();
const   port = process.env.PORT || 3000;

app.use(bodyParser.json()); // must use bodyParser in express
app.use(webhookHandler); // use our middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose();

// Set Express routes.
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.set('view engine', 'handlebars');app.engine('handlebars', hbs({
    defaultLayout: 'layout',
    layoutDir: __dirname + '/views/layouts',
    partialsDir  : [__dirname + '/views/partials',]
}));

app.set('view engine', 'handlebars');

const      server = require('http').createServer(app);
const      io = new require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

    github.on('*', function (event, repo, data) {
        console.log('hejhopp')
    });

    github.on('issues', function (repo, data) {
        console.log('hejhopp')
    });

    github.on('error', function (err, req, res) {
        console.log('err')
    });


//routes
app.use('/', require('./routes/main.js'));

//console what port that the app uses
app.listen(port, () => console.log(`Express app listening on port ${port}!`
    + '\nIf you want to terminate press ctrl+c'));

