import io from 'socket.io-client';

export default function () {
    const socket = io('http://localhost:5000')

   socket.on('get_list_channels', data => {
       console.log(data);
   })
    socket.on('error', function (err) {
        console.log('received socket error:')
        console.log(err)
    })

    return socket;

}

