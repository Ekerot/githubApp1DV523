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
const GitHubApi = require('github');

router.route('/')    //function just to render first page
    .get(function(req, res) {

        res.render('main/index')
    });

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
                process.env['AUTH_TOKEN'] = accessToken;
                return done(null, profile);
            });
        }
    ));
//--------------------------------- CONFIGURE PASSPORT ----------------------------------

router.use(partials());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(methodOverride());
router.use(session({ secret: 'kissmehoneyhoneykissme', resave: false, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());

//----------------------------------------------------------------------------------------

    router.get('/auth/github',
        passport.authenticate('github', {scope: ['user:email']}),
        function (req, res) {

        });

    router.get('/auth/github/callback',
        passport.authenticate('github', {failureRedirect: '/'}),
        function (req, res) {

            let github = new GitHubApi({
                // optional
                debug: true,
                protocol: 'https',
                host: 'api.github.com', // should be api.github.com for GitHub
                headers: {
                    'user-agent': 'github-issue-handler' // GitHub is happy with a unique user agent
                },
                Promise: require('bluebird'),
                followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
                timeout: 5000
            });

            github.authenticate({
                type: "oauth",
                token: process.env.AUTH_TOKEN
            });

            github.repos.getAll({type: 'owner'}, function(err, request){

                let jsonObject = request;

                let repo = {            //creating context variable to send to view

                    repo: jsonObject.map(function (repo) {
                        return {
                            name: repo.name,
                            id: repo.id,
                        }
                    })
                };
                let data = {user:req.user, repo}

                res.render('main/index', repo)
            });

        });

    router.get('/auth/github/logout', function (req, res) {
        req.session.destroy(function() {
        res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });

    router.route('/issues/:name')
    .get(ensureAuthenticated, function(request, response) {

        let github = new GitHubApi({
            // optional
            debug: true,
            protocol: 'https',
            host: 'api.github.com', // should be api.github.com for GitHub
            headers: {
                'user-agent': 'github-issue-handler' // GitHub is happy with a unique user agent
            },
            Promise: require('bluebird'),
            followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
            timeout: 5000
        });

        github.authenticate({
            type: "oauth",
            token: process.env.AUTH_TOKEN
        });

        github.issues.getForRepo({owner: request.user.username, repo: request.params.name}, function (err, res) {

            let jsonObject = res;

            let issues = {            //creating context variable to send to view

                issues: jsonObject.map(function (issues) {
                    return {
                        title: issues.title,
                        id: issues.id,
                        body: issues.body,
                        comments: issues.comments,
                        created_at: issues.created_at,
                        html_url: issues.html_url,
                        login: issues.user.login,
                        avatar_url: issues.user.avatar_url,
                    }
                })
            };

            response.render('main/index', issues)
    });

    });

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.render('errors/401')
}

module.exports = router;
