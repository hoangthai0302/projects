
import Msg from 'constants/Msg';
import { observable, action, configure, runInAction, computed } from 'mobx';

export default class WS {
    constructor(rootStore) {
        this.rootStore = rootStore;
        ws = new WebSocket('wss://localhost:5000');
        let that = this; // cache the this
        var connectInterval;

        // websocket onopen event listener
        ws.onopen = () => {
            that.timeout = 250; 
            clearTimeout(connectInterval); 
        };

        ws.onmessage = this.onMessage;

        ws.onclose = e => {
            console.log(
                `Socket is closed. Reconnect will be attempted in ${Math.min(
                    10000 / 1000,
                    (that.timeout + that.timeout) / 1000
                )} second.`,
                e.reason
            );

            that.timeout = that.timeout + that.timeout; //increment retry interval
            connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
        };
    }

    @observable clients = [];

    send = msg => {
        try {
            this.ws.send(JSON.stringify(msg));
        } catch(ex) {
            console.log(ex);
        }
    }

    chatToPublic = msg => {
        this.send({
            type: CHAT_TO_PUBLIC,
            content: msg
        })
    }

    onMessage = e => {
        const { data } = e;
        const msg = JSON.parse(data);
        const { type } = msg;

        switch (type) {
            case Msg.LOGIN :
                this.onClientLogin(msg);
                break;
            case Msg.CHAT_TO_PUBLIC:
                this.onChatToPublic(msg)
        }
        
    }

    onClientLogin = ({ clientID, clientName }) => {
        this.clients.push(new Client(clientID, clientName));
    }

    clientDisconnect = ({ clientID }) => {
        this.clients = this.clients.filter(c => c.clientID !== clientID);
    }

    onChatToPublic = msg => {
        console.log(msg);
    }


}



    