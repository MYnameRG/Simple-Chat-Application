const socket = io();

function scrollAuto(){
    const message = document.querySelector('#messages').lastElementChild;
    message.scrollIntoView();
}

socket.on('connect', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {
        name: urlParams.get('name'),
        room: urlParams.get('room')
    };

    socket.emit('join', params, (err) => {
        if(err){
            alert(err);
            window.location.href = '/';
        }
        else
        {
            console.log('No Error');
        }
    })

    document.querySelector('#submit-btn').addEventListener('click', function(e) {
        e.preventDefault();
        socket.emit('createMessage', {
            from: params.name,
            text: document.querySelector('input[name="message"]').value
        });
    });
});

/*socket.emit('createMessage', {
    from: 'Rohit',
    text: 'Hello Everyone'
}, (message) => {
    console.log('Got it', message);
});*/ 

socket.on('updateUsers', (users) => {
    const ol = document.createElement('ol');
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    });
    const list = document.querySelector('#users');
    list.innerHTML = '';
    list.appendChild(ol);
});

socket.on('newMessage', (message) => {
    //console.log('Message:', message);

    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });
    const div = document.createElement('div');
    div.innerHTML = html;
    document.querySelector('#messages').append(div);
    scrollAuto();
    
    /*const formattedTime = moment(message.createdAt).format('LT');
    const li = document.createElement('li');
    li.style.listStyleType = 'none';
    li.innerText = `${message.from} ${formattedTime}: ${message.text}`;
    li.style.backgroundColor = 'skyblue';
    li.style.borderRadius = '10px';
    document.querySelector('body').appendChild(li);*/ 
});  

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
