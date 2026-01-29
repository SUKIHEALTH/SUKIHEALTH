// src/components/ChatComponent.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const WebSocketService = (() => {
  let socket = null;

  // Initialize WebSocket connection
  const connect = () => {
    socket = io("http://localhost:5001", {
      withCredentials: true,
    });

    // Listen for connection events
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Emit event to indicate connection status to the frontend
      socket.emit('status', { connected: true });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      // Emit event to indicate disconnection status
      socket.emit('status', { connected: false });
    });

    // Listen for incoming messages
    socket.on('message', (data) => {
      console.log('Received message:', data);
    });
  };

  // Send message
  const sendMessage = (senderId, receiverId, message, messageType) => {
    const messageData = {
      senderId,
      receiverId,
      message,
      messageType,
    };

    if (socket) {
      socket.emit('message', JSON.stringify(messageData));
    }
  };

  // Close connection
  const closeConnection = () => {
    if (socket) {
      socket.close();
    }
  };

  return {
    connect,
    sendMessage,
    closeConnection,
    socket, // Expose socket for external use
  };
})();

const ChatComponent = () => {
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageType, setMessageType] = useState('text');
  const [isConnected, setIsConnected] = useState(false); // Track connection status

  useEffect(() => {
    // Establish the WebSocket connection when the component mounts
    WebSocketService.connect();

    // Listen for connection status changes
    WebSocketService.socket.on('status', (status) => {
      setIsConnected(status.connected);
    });

    // Cleanup the WebSocket connection when the component unmounts
    return () => {
      WebSocketService.closeConnection();
    };
  }, []);

  const handleSendMessage = () => {
    if (senderId && receiverId && message.trim()) {
      WebSocketService.sendMessage(senderId, receiverId, message, messageType);
      setMessage('');
    } else {
      console.log('Missing required fields for sending message');
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        <input
          type="text"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          placeholder="Sender ID"
        />
        <input
          type="text"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          placeholder="Receiver ID"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      {/* Display connection status */}
      <div>
        <h3>Status: {isConnected ? 'Connected' : 'Disconnected'}</h3>
      </div>

      <div>
        <h3>Messages</h3>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.senderId}:</strong> {msg.message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ChatComponent;
