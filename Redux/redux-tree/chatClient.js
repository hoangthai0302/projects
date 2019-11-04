// if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    var connection = new WebSocket('ws://localhost:3000');

    connection.onopen = function () {
        // connection is opened and ready to use
    };

    connection.onerror = function (error) {
        // an error occurred when sending/receiving data
    };

    connection.onmessage = function (message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        // handle incoming message
    };

    var ChatClient = {
        init(option){
            this.onMessage = option.onMessage;
            this.onOpen = option.onOpen;
            this.onError = option.onError;
            this.onClose = option.onClose;

        },
        connect(){
            window.WebSocket = window.WebSocket || window.MozWebSocket;

            var connection = new WebSocket('ws://localhost:3000');
            this.connection = connection;
            var that = this;

            connection.onopen = function () {
                that.onOpen();    
            };

            connection.onerror = function (error) {
                // an error occurred when sending/receiving data
                that.onError();
            };

            connection.onmessage = function (message) {
                // try to decode json (I assume that each message from server is json)

                try {
                    var json = JSON.parse(message.data);
                } catch (e) {
                    console.log('This doesn\'t look like a valid JSON: ', message.data);
                    return;
                }

                // handle incoming message
                that.onMessage(json);
            };
        },

        sendMsg(msg){
            if(this.connection && _msg){
                var _msg = JSON.stringify(msg);
                if(_msg){
                    connection.send(_msg);
                }
            }
        }
    }

    export default ChatClient;