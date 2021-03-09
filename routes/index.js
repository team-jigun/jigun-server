const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {success: req.query.success, failed: req.query.failed})
});

router.post('/', (req, res) => {
    console.log(req.body)
    let sender = req.body.sender
    let message = req.body.message
    let target = req.body.key

    const io = req.app.get('io')
    
    const sockets = io.of('/').sockets
    let isFound = false;
    sockets.forEach((socket, key, map) => {
        if(socket.key === target) {
            isFound = true;
            socket.emit('jigun', sender, message, () => {
                return res.redirect('/?success=true')   
            }); 
        }
    })
    if(!isFound) return res.redirect('/?failed=true')
});

module.exports = router;