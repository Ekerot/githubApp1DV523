'use strict';

/**
 * Created by ekerot on 2017-01-01.
 */

var io = require('socket.io');

var socket = io.connect('https://localhost:3000');

socket.on('webhook', function(hook){
     console.log(hook)

});