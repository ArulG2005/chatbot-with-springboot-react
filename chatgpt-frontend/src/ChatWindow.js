// src/ChatWindow.js
import React from 'react';
import styled from 'styled-components';

const ChatWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow-y: auto;
  max-height: 100%;
`;

const Message = styled.div`
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  background-color: ${({ sender }) => (sender === 'user' ? '#e1ffc7' : '#f1f1f1')};
  align-self: ${({ sender }) => (sender === 'user' ? 'flex-end' : 'flex-start')};
`;

const ChatWindow = ({ messages }) => {
  return (
    <ChatWindowContainer>
      {messages.map((msg, index) => (
        <Message key={index} sender={msg.sender}>
          {msg.text}
        </Message>
      ))}
    </ChatWindowContainer>
  );
};

export default ChatWindow;
