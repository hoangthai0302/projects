const express = require('express');
const app = express();
//Socket.io has to use the http server
const server = require('http').Server(app);

//Socket.io
const io = require('socket.io')(server);
let onlineUsers = {};
let rooms = {
    'hvn': {
        messages: [
            {
                sender: 'thai',
                message:'Hello!',
                createdAt: '2019/05/01 00:00:00'
            }
        ]
    }
}
io.on("connection", (socket) => {
    require('./chat.js')(io, socket, onlineUsers, rooms);
})

// //Express View Engine for Handlebars
// const exphbs  = require('express-handlebars');
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');

// //Establish your public folder
// app.use('/public', express.static('public'))

// app.get('/', (req, res) => {
//     res.render('index.handlebars');
// })

server.listen('5000', () => {
    console.log('IO Server listening on Port 5000');
})