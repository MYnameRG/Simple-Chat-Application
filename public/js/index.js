const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.emit('createMessage', {
    from: 'Rohit',
    text: 'Hello Everyone'
}, (message) => {
    console.log('Got it', message);
});

socket.on('newMessage', (message) => {
    console.log('Message:', message);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});