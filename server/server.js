const express = require('express');
const app = express();

const path = require('path');
const socketIO = require('socket.io');

const server = require('http').createServer(app);
const publicPath = path.join(__dirname, '/../public');
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connect', (socket) => {
    console.log('User connected...');

    socket.on('disconnect', () => {
        console.log('User disconnected...');
    });
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
})