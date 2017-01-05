'use strict';

/**
 * Created by ekerot on 2017-01-05.
 */

const router = require('express').Router();
const express = require('express');
const passport = require('passport');
const util = require('util');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const GitHubStrategy = require('passport-github2').Strategy;
const partials = require('express-partials');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

    passport.use(new GitHubStrategy({
            clientID: '7e66ee29510aa0f4db54',
            clientSecret: '2284eb7c2af97ba1151befe9a98a3f009afda80c',
            callbackURL: "http://localhost:3000/auth/github/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {

                // To keep the example simple, the user's GitHub profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the GitHub account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    ));

router.use(partials());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(methodOverride());
router.use(session({ secret: 'kissmehoneyhoneykissme', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
router.use(passport.initialize());
router.use(passport.session());

    router.get('/auth/github',
        passport.authenticate('github', {scope: ['user:email']}),
        function (req, res) {

        });

    router.get('/auth/github/callback',
        passport.authenticate('github', {failureRedirect: '/'}),
        function (req, res) {
            console.log(req.user)
            res.render('main/index', {user:req.user});
        });

    router.get('/auth/github/logout', function (req, res) {
        req.session.destroy(function() {
        res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });

module.exports = router;
