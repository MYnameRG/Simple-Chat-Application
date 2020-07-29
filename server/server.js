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

    socket.on('createMessage', (message) => {
        console.log('Message:', message);
    });

    /*io.emit('newMessage', {
    from: 'Admin',
    text: 'Hello User',
    Date:  new Date().getTime()     
    });*/

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New User Joined!',
        Date:  new Date().getTime()        
    });

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to chat app!',
        Date:  new Date().getTime()        
    });

    socket.on('disconnect', () => {
        console.log('User disconnected...');
    });
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
})