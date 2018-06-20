const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

let numberOnline = 0;
let status;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

io.on('connection', (socket) => {
    
    numberOnline++;
    socket.on('users', (username) => {
        io.emit('users', { type: 'users', usernames: username, num: numberOnline, status: 'joined' });
    });
    socket.on('message', (message, username) => {
        io.emit('message', { type: 'message', text: message, username: username });
    });
    socket.on('disconnect', function() {
        numberOnline--;
        io.emit('users', { type: 'users', username: '-', num: numberOnline, status: 'left'});
    });

});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});