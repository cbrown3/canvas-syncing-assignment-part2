const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html'});
    response.write(index);
    response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

// pass in the htttp server into socketio and grab the websocket server as io
const io = socketio(app);

const onJoined = (sock) => {
    const socket = sock;
    
    socket.on('join', (data) => {
        
        socket.join('room1');
    });
    
    socket.on('updatePara', (data) => {
        console.dir(data);
        io.sockets.in('room1').emit('updatePara', data);
    });
    
};

const onDisconnect = (sock) => {
     sock.on('disconnect', () => {
        sock.leave('room1');
        });
};

io.sockets.on('connection', (socket) => {
    console.log('started');
    
    onJoined(socket);
    onDisconnect(socket);
});

console.log('Websocket server started');