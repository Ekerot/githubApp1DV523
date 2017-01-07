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

passport.use(new GitHubStrategy({                           //making a strategy to login with oauth2
        clientID: "7e66ee29510aa0f4db54",
        clientSecret: "2284eb7c2af97ba1151befe9a98a3f009afda80c",
        callbackURL: "https://www.ekerot.se/auth/github/callback"
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
router.use(session({ secret: 'kissmehoneyhoneykissme', resave: false, saveUninitialized: false}));
router.use(passport.initialize());
router.use(passport.session());

//----------------------------------------------------------------------------------------

router.get('/auth/github',
    passport.authenticate('github', {scope: ['admin:repo_hook']}),
    function (req, res) {
    });

router.get('/auth/github/callback',                             //authentication callback, selecting all repos
    // and listing them in the nav bar
    passport.authenticate('github', {failureRedirect: '/'}),
    function (req, res) {

        let github = new GitHubApi({  //setup to access the GitHub API
            // optional
            debug: true,
            protocol: 'https',
            host: 'api.github.com', // should be api.github.com for GitHub
            headers: {
                'user-agent': 'github-issue-handler' // GitHub is happy with a unique user agent
            },
            Promise: require('bluebird'),
            followRedirects: false,
            timeout: 5000
        });

        github.authenticate({  //authenticate user with Oauth
            type: "oauth",
            token: process.env.AUTH_TOKEN
        });

        github.repos.getAll({type: 'owner'}, function(err, request){  //get all repositories

            let jsonObject = request;

            req.session['repo'] = {
                repo: jsonObject.map(function (repo) {
                    return {
                        name: repo.name,
                        id: repo.id,
                    }
                })
            };
            req.session['nav'] = {
                username: req.user.username,
                avatar_url: req.user._json.avatar_url,
                email: req.user._json.email,
                displayName: req.user.displayName
            };
            console.log(req.session)
            res.render('main/index', req.session)
        });
    });

router.get('/logout', function (req, res) {  //logout function, kill/clear cookie manually
    // --- .logout() not supported in Express 4
    req.session.destroy(function() {
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

router.route('/:name')
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
            type: 'oauth',
            token: process.env.AUTH_TOKEN
        });

        console.log(request.session.repo.repo.id)

        github.repos.pingHook({repo:request.session.repo.repo.name},
            {id:response.repo.id}, (err, req, res) => {

                console.log(req)

            } );

        github.repos.createHook({
            "owner": request.nav.username,
            "repo": request.params.name,
            "name": "web",
            "active": true,
            "events": [
                "issues",
                "issue_comment"
            ],
            "config": {
                "url": "https://www.ekerot.se/webhook",
                "content_type": "json",
                "secret": "kljfd9823u4nfkls923nfdjks989324",
                "insecure_ssl": "1"
            }
        }, function (err, req, res) {

            console.log(err);
            response.redirect('/:name');
        });

//TODO: Get sessionId get repository ID seperate usersSession and use session to store values

//get all issues from selected repo
        github.issues.getForRepo({owner: request.nav.username, repo: request.params.name}, function (err, req) {

            let jsonObject = req;

            console.log(jsonObject)

            request.session['issues'] = {

                issues: jsonObject.map(function (issues) {
                    return {
                        title: issues.title,
                        id: issues.id,
                        body: issues.body,
                        comments: issues.comments,
                        created_at: issues.created_at,
                        html_url: issues.html_url,
                        login: issues.user.login,
                        avatar_url: issues.user.avatar_url
                    }
                })
            };

            console.log(request.session)
            response.render('main/index', request.session)
        })
    });

//function to authenticate user
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.render('errors/401')
}

module.exports = router;