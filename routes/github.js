'use strict';

/**
 * Created by ekerot on 2017-01-05.
 */

//TODO: Making new function: close issue from application, try to clean som more code.

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
    .get((req, res) => {

        res.render('main/index')
    });

//serialize user into session. This will be as simple as storing the user ID when serializing, and finding
//the user by ID when deserializing.
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new GitHubStrategy({                           //making a strategy to login with oauth2
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'https://www.ekerot.se/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        // asynchronous verification, for effect...
        process.nextTick(() => {
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

//calling github for authentication and callback
router.get('/auth/github',
    passport.authenticate('github', {scope: ['admin:repo_hook']}),
    (req, res) => {
    });

router.get('/auth/github/callback',                             //authentication callback, selecting all repos
    // and listing them in the nav bar
    passport.authenticate('github', {failureRedirect: '/'}),
    (req, res) => {

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

        github.repos.getAll({type: 'owner'},(err, request) => {  //get all repositories and send them to the templates
            if(err) console.log('Error:', err);

            let jsonObject = request;

            //we need this in the seesion, we don´t want users information to get mixed up / data leaks

            req.session['repo'] = {
                repo: jsonObject.map((repo) => {
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

            res.render('main/index', req.session)
        });
    });

router.get('/logout',(req, res) => {  //logout function, kill/clear cookie manually
    // --- .logout() not supported in Express 4
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.clearCookie('wherethehellismysecretpasswordforgotitagain');
        res.redirect('/');
    });
});

router.route('/:name')
    .get(ensureAuthenticated,(request, response) => {

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

        request.session.repo.repo.name((repo) => {

            if (repo.name === request.params.name) {

                github.repos.deleteHook({owner: request.user._json.login, repo: repo.id});

            }

        });

        github.repos.createHook({              // If the repo don´t have any hook we need to create one
            "owner": request.user._json.login,
            "repo": request.params.name,
            "name": "web",
            "active": true,
            "events": [
                "issues",
                "issue_comment",
                "notification",
            ],
            "config": {
                "url": "https://www.ekerot.se/webhook",
                "content_type": "json",
                "secret": "kljfd9823u4nfkls923nfdjks989324",
                "insecure_ssl": "1"
            }
        },(err, req, res) =>{
                    if(err) console.log('Error:', err);
        });

        //get all issues from selected repo
        github.issues.getForRepo({owner: request.user._json.login, repo: request.params.name},(err, req) => {

            if(err) console.log(err);

            let jsonObject = req;
            console.log.(request

            //we need this in the seesion, we don´ want users information to get mixed up / data leaks
            request.session['issues'] = {

                issues: jsonObject.map((issues) => {
                    return {
                        repo: request.params.name,
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
            response.render('main/index', request.session)
        });
    });

//function to authenticate user
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.render('errors/401')
}

module.exports = router;