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
const   webhook = require('./lib/webhook.js');

const   app = express();
const   port = process.env.PORT || 3000;

mongoose();
webhook();


app.post('/', function (req, res) {

    console.log(res);

    res.json({
        message: 'ok got it!'
    });
});

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
app.use('/hooks', require('./routes/main.js'));

//console what port that the app uses
app.listen(port, () => console.log(`Express app listening on port ${port}!`
    + '\nIf you want to terminate press ctrl+c'));

