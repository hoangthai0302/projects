import io from 'socket.io-client';

export const setupWebsocket = ({ host, port }) =>
    new Promise((resolve) => {

        const socket = io('http://localhost:5000')

        socket.on('connect', () => {
            socket
                .emit('authenticate', { token }) //send the jwt
                .on('authenticated', () => {
                    //go to home page
                    resolve(socket);
                })
                .on('unauthorized', (msg) => {
                    console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
                    throw new Error(msg.data.type);
                    //hien thi thong bao loi
                })
        });

        socket.on('error', function (err) {
            console.log('received socket error:')
            console.log(err)
        })
    });


export default function () {
    const token = localStorage.getItem('token');

    if(!token) {
        //redirect to login
    } else {

        
    }

    return socket;

}

