const express = require('express');
const app = express();

const path = require('path');
const socketIO = require('socket.io');
const generateMessage = require('./utils/message');

const server = require('http').createServer(app);
const publicPath = path.join(__dirname, '/../public');
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connect', (socket) => {
    console.log('User connected...');

    socket.on('createMessage', (message, callback) => {
        console.log('Message:', message);
        callback('This is server here.');
    });

    /*io.emit('newMessage', {
    from: 'Admin',
    text: 'Hello User',
    Date:  new Date().getTime()     
    });*/

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app!'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined!'));

    socket.on('disconnect', () => {
        console.log('User disconnected...');
    });
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
})