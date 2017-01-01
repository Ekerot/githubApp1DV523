/**
 * Created by ekerot on 2016-12-30.
 */

const app = require('express')();
const server = require('http').createServer(app);
const io = new require('socket.io')(server);


module.exports = function() {

// Set socket.io listeners.
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

// Set Express routes.
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/views/index.html');
    });

};