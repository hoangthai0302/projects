
import { Message } from './constants.mjs';

class Client {
    constructor(client, req, wss) {
        this.client = client;
        this.wss = wss;
        client.on('message', this.onMessage);
        client.on('close', this.onClose)
    }

    onMessage = message => {
        
    }

    onClose = () => {
        this.sendAll({
            type: Message.CLIENT_OFF
        })
    }

    sendTo = () => {

    }

    sendAll = (msg, includeMe) => {
        this.server.clients.forEach(c => {
            const check = inCludeMe ? true : (client !== ws);

            if (check && client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
    }
}