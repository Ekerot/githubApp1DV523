'use strict';

/**
 * Created by ekerot on 2016-12-20.
 */

const router = require('express').Router();

router.route('/')    //function just to show first page
    .get(function(req, res) {

        res.render('main/index');
    });

module.exports = router;
