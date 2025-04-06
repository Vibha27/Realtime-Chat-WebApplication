// useEffect is hook that lets u use lifecycle methods or side-effects in func components
import React, { useState,useEffect } from 'react';

// this will retrive data from url
import queryString from 'query-string';

import io from 'socket.io-client';
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import { useLocation, useNavigate } from 'react-router';

let socket;

const Chat = ()=>{

    const location = useLocation();

    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);
    const ENDPOINT = 'http://localhost:5000/';
    // const ENDPOINT = 'https://baatekaroapp.herokuapp.com/';

    // similar to componentDidMount() and componentDidUpdate()
    useEffect(()=>{
        // it runs when data is fill in form and then fetch data from url
        const {name,room} = queryString.parse(location.search);

        // when we get our first connection ,connecting to server port 5000
        socket = io(ENDPOINT);
        console.log(socket, name, room);
       
        // it sets name,room 
        setName(name);
        setRoom(room);

    // emit data from client to server when connected and goes in io.on('connection')
    // it print "we have new connection and name,room" 
       socket.emit('join', { name, room}, ()=>{
           
       });

    // disconnect when user left
    return()=>{
        socket.emit('disconnect');
        socket.off();
    }
    },
    // useEffect executes only when [ENDPOINT,location.search] values changes.
    [ENDPOINT, location.search]);

    // for handling messages
    useEffect(()=>{
        // refer index.js socket.on('message')
        socket.on('message', (message)=>{
            setMessages(messages => [...messages,message])
        })
      }, []);
      
    // function for sending messages
    const sendMessage = (event)=>{
        event.preventDefault();

        if(message){
            socket.emit('sendMessage',message, ()=> setMessage(''));
        }
    }

    console.log(message,messages)

    return(  
        <div className="outerContainer">
            <div className="container">
                <InfoBar  room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            
        </div>
    );
}

  

export default Chat;