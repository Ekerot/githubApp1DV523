'use strict';

/**
 * Created by ekerot on 2016-12-20.
 */

const express = require('express');
const hbs = require('express-handlebars');

const app = express();
const port = process.env.PORT || 4567;

app.engine('handlebars', hbs({
    defaultLayout: 'layout',
    layoutDir: __dirname + '/views/layouts',
    partialsDir  : [__dirname + '/views/partials',]
}));

app.set('view engine', 'handlebars');

//routes
app.use('/', require('./routes/main.js'));

//console what port that the app uses
app.listen(port, () => console.log(`Express app listening on port ${port}!`
    + '\nIf you want to terminate press ctrl+c'));

