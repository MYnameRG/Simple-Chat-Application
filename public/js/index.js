const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

/*socket.emit('createMessage', {
    from: 'Rohit',
    text: 'Hello Everyone'
});*/

socket.on('newMessage', (message) => {
    console.log('Message:', message);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});