

import websocket from 'ws'
import { Message } from './constants.mjs';

var wss = new websocket.Server({ 
    port: 5000 
});
console.log('server started!')

wss.on('connection', function(client, req) {
    var ip  =  req.connection.remoteAddress;
    client.ip = ip;
  
    var originalSend = client.send;
    client.send = function(msg) {
        originalSend(JSON.stringify(msg))
    }

    client.on('message', function(message) {
        try {
            message = JSON.parse(message);
        } catch (error) {
            console.log('Message invalid')
        }

        if(message && message.type) {
            handleMessage(message, client , wss);
        }

    });

    client.on('close', function() {
        console.log(' close connection')
    })
})

function handleMessage(message, client, wss){

    if(message.type === Message.LOGIN) {
        const {
            username
        } = message;

        client.username = message.username;
        sendAll({
            type: Message.LOGIN,
            user: {
                name: username
            }
        }, true)

    }

    if(message.type === Message.JOIN_GAME) {

    }
}

function sendAll(msg, excludeMe) {
    wss.clients.forEach(function each(client) {
        const check = excludeMe ? (client !== ws) : true;

        if (check && client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
}
