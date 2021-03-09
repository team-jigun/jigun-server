const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser')
const fs = require('fs');

io.use((socket, next) => {
    console.log(socket.handshake.query.key)
    const sockets = io.of('/').sockets
    for(let socket in sockets) {
        if(sockets[socket].key === socket.handshake.query.key) {
            console.log(`Socket with existing key(${socket.handshake.query.key}) tried to connect, ignoring`);
            next(Error("SOCKET_KEY_EXISTS"));
        }
    }
    socket.key = socket.handshake.query.key;
    next()
});

io.on('connection', (socket) => {
    console.log(socket.key + " connected");
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(express.static('static'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

listAllFiles(path.join(__dirname, './routes')).forEach((file) => {
    let routename = path.basename(file).slice(0, file.length - 3);
    if(routename = 'index') {
        routename = '/';
    }
    app.use(routename, require(file));
});

server.listen(9999, () => {
    console.log('Listening on port 9999');
});

app.set('io', io)

function listAllFiles(dir, files) {
    if(!files) files = [];
    let filelist = fs.readdirSync(dir)
    for(let file in filelist) {
        let fullPath = path.join(dir, filelist[file]);
        if (fs.lstatSync(fullPath).isDirectory()) {
           console.log(fullPath);
           listAllFiles(fullPath);
         } else {
           console.log(fullPath);
           files.push(fullPath);

         }  
    } 
    return files;
}