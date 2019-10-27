

import websocket from 'ws'
import { LOGIN } from './actions.mjs';
import { HALL } from './screen';

class Server {
    constructor() {
        this.wss = new websocket.Server({ 
            port: 5000 
        });
        console.log('server started!')
        
        this.wss.on('connection', this.onConnection);
    }

    clients = [];

    onConnection = (client, req) => {
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
                if(message.type === LOGIN) {
                    client.screen = HALL;
                    this.clients.push(client)
                    //update hall of the client
                    this.updateClientHall(client);
                    //
                    this.updateOtherClientsInHall(client);
            
                }
            
                if(message.type === Message.JOIN_GAME) {
            
                }
            }
    
        });
    
        client.on('close', function() {
            console.log(' close connection')
        })
    }

    sendAll = (msg, excludeClient) => {
        this.clients.forEach(c => {

        })
    }

    updateClientHall = client => {
        this.clients.forEach(function each(c) {
            const check = excludeMe ? (client !== ws) : true;
    
            if (check && client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
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
