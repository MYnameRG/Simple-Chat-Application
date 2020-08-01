const express = require('express');
const app = express();

const path = require('path');
const socketIO = require('socket.io');
const generateMessage = require('./utils/message');
const Users = require('./utils/users');
const users = new Users();

const server = require('http').createServer(app);
const publicPath = path.join(__dirname, '/../public');
const io = socketIO(server);

app.use(express.static(publicPath));

//console.log(path.join(__dirname,'/../public'));

// app.use('/',(req,res,next)=>{
//     res.sendFile(path.join(__dirname , '/../public/chat_join.html'));
//     next();
// });

app.get('/',(req, res) => {
    return res.sendFile(path.join(__dirname,'/../public') + '/join.html');
});

// app.get('/index.html',(req, res) => {
//     res.sendFile(path.join(__dirname,'/../public') + '/index.html');
// });

io.on('connect', (socket) => {
    console.log('User connected...');

    socket.on('createMessage', (message, callback) => {
        //console.log('Message:', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            Date:  new Date().getTime()     
        });
    });

    socket.on('join', (params, callback) => {
        if(!(typeof params.name === 'string' && params.name.trim().length > 0) || !(typeof params.room === 'string' && params.room.trim().length > 0))
        {
            return callback('Name or room is required!!!');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        //console.log(users);
        //console.log(users.getUserList(params.room))
        
        //The message is broadcasted to everyone including you
        io.to(params.room).emit('updateUsers', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', `Welcome to the ${params.room} room!`));

        //The message is broadcasted to everyone except you
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} Joined!!`));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected...');

        //After every refresh moment, user disconnected from the server --Remember
        const user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUsers', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left from the ${user.room}!!`));
        }
    });
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
})