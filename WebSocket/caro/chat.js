module.exports = (io, socket, onlineUsers, channels) => {

    //khi vua ket noi, tra ve danh sach room
    socket.emit('get_room_list', ['HVN_Workplace', 'PVS']);
    socket.on('new user', (username) => {
        onlineUsers[username] = socket.id;
        socket["username"] = username;
        console.log(`${username} has joined the chat! ✋`);
        io.emit("new user", username);
    });
  
    //Listen for new messages
    socket.on('new message', (data) => {
        channels[data.channel].push({sender : data.sender, message : data.message});
        io.to(data.channel).emit('new message', data);
    });
  
    socket.on('get online users', () => {
        //Send over the onlineUsers
        socket.emit('get online users', onlineUsers);
    });
  
    //This fires when a user closes out of the application
    socket.on('disconnect', () => {
        //This deletes the user by using the username we saved to the socket
        delete onlineUsers[socket.username]
        io.emit('user has left', onlineUsers);
    });
  
    socket.on('new channel', (newChannel) => {
        console.log(newChannel);
    });
  
    socket.on('new channel', (newChannel) => {
        //Save the new channel to our channels object. The array will hold the messages.
        channels[newChannel] = [];
        //Have the socket join the new channel room.
        socket.join(newChannel);
        //Inform all clients of the new channel.
        io.emit('new channel', newChannel);
        //Emit to the client that made the new channel, to change their channel to the one they made.
        socket.emit('user changed channel', {
            channel : newChannel,
            messages : channels[newChannel]
        });
    });
  
    //Have the socket join the room of the channel
    socket.on('user changed channel', (newChannel) => {
        socket.join(newChannel);
        socket.emit('user changed channel', {
            channel : newChannel,
            messages : channels[newChannel]
        });
    });
  };