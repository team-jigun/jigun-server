const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

router.post('/', (req, res) => {
    console.log(req.body)
    let sender = req.body.sender
    let message = req.body.message
    let target = req.body.key

    const io = req.app.get('io')
    
    const sockets = io.of('/').sockets
    sockets.forEach((socket, key, map) => {
        if(socket.key === target) {
            socket.emit('jigun', sender, message, (message) => {
                console.log(message)
            }); 
        }
    });
    console.log('no user found')

    res.redirect('/');
});

module.exports = router;