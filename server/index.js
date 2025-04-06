const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const router = require('./router');

// setup socket.io used for data tranferring (realtime,instant-messaging)
//google socket.io docs
const server = http.createServer(app);
//instance of server
const io = socketio(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

// importing users module
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

// io.on() is is used to register client joining and leaving.
// "connection" is built-in keyword for checking client connected or not.
io.on('connection', (socket)=>{
    
    // it print name,room from client Chat.js socket.emit() method
    socket.on('join',({name,room},callback)=>{

        // addUser() can return only error or user
        const { error, user } = addUser({id: socket.id, name, room});

        if(error) return callback(error);

        // Message to user when user enters
        socket.emit('message', { user: 'admin', text: `${user.name}, Welcome to room ${user.room}` });
        // Letting everyone else knows that user has joined
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`});

        //join user in room
        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users:getUsersInRoom(user.room)});

        callback();

        
    });

    // creating events for user generated message
    socket.on('sendMessage', (message,callback)=>{
        const user = getUser(socket.id);
        // sending message and user name to specific room
        io.to(user.room).emit('message',{ user: user.name, text: message});
        io.to(user.room).emit('roomData',{ room:user.room,users:getUsersInRoom(user.room)});
        callback();

    });
    // 'disconnect keyword exe when user disconnect
    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',{ user: 'admin', text: `${user.name} has left!`})
        }
    });
});

app.use(router);

//listening port 
server.listen(port, ()=> console.log(`server started on port : ${port}`));