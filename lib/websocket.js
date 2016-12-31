/**
 * Created by ekerot on 2016-12-30.
 */

const app = require('express')();
const server = require('http').createServer(app);
const io = new require('socket.io')(server);


module.exports = function() {

    io.on('connection', function () {

        io.emit('message', 'Hello dear!');
    });

    console.log('Websocket is online on port 3030')
    server.listen(3030);

};