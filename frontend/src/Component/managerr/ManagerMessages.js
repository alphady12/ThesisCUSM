import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEnvelope } from 'react-icons/fa';
import './Messages.css';


const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchMessages();
  }, []);


  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages');
    }
  };


  const deleteMessage = async (messageId) => {
    const confirmed = window.confirm('Do you want to delete this message?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3001/api/messages/${messageId}`);
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
        setError('Failed to delete message');
      }
    }
  };


  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2>Messages</h2>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="messages-list">
        {messages.map(message => (
          <div className="message-item" key={message.message_id}>
            <div className="message-content">
              <div className="message-header">
                <strong>{message.name}</strong>
                <span className="message-time">Just now</span>
              </div>
              <div className="message-body">
                {message.message}
              </div>
            </div>
            <div className="message-actions">
              <FaEnvelope
                onClick={() => window.location.href = `mailto:${message.email}`}
                className="reply-icon"
              />
              <FaTrashAlt
                onClick={() => deleteMessage(message.message_id)}
                className="delete-icon"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Messages;
