import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Message.css'

const SOCKET_URL = 'https://agora-live-backend.vercel.app/messages';

const Message = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  useEffect(() => {
    const socketIo = io(SOCKET_URL);
    setSocket(socketIo);

    socketIo.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketIo.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socketIo.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && input) {
      const messageData = { message: input, sender: username };
      socket.emit('message', messageData);
      setInput('');
    }
  };

  const handleSetUsername = () => {
    if (username) {
      setIsUsernameSet(true);
    }
  };
  console.log("This is user msg",messages)

  return (
    <div className="container">
    {!isUsernameSet ? (
      <div className="username-container">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSetUsername}>Set Username</button> 

      </div>
    ) : (
      <div className="chat-container">
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.sender === username ? 'You' : msg.sender}:</strong> {msg.message}
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    )}
  </div>
  );
};

export default Message;