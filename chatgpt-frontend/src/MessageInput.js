// src/MessageInput.js
import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #e1e1e1;
  background-color: #f8f9fa;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 20px;
  font-size: 16px;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  width: 90%;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
   margin-right:50px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:disabled {
    background-color: #b0b0b0;
    cursor: not-allowed;
  }
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  bottom: 60px;
  width: calc(100% - 40px);
  background-color: white;
  border: 1px solid #e1e1e1;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const SuggestionItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const predefinedQuestions = {
  1: "Library Hours",
  2: "Total Books",
  3: "Total Journals",
  4: "List of Journals",
  5: "Late Fee Amount",
  6: "Membership Fee",
  7: "Borrowing Limits",
  8: "Reservation System",
  9: "Library Services",
  10: "Special Collections",
};

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);
    
    if (inputValue.startsWith('/')) {
      const filteredSuggestions = Object.values(predefinedQuestions).filter(question => 
        question.toLowerCase().includes(inputValue.slice(1).toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    setSuggestions([]);
  };

  return (
    <InputContainer>
      <div style={{ position: 'relative', width: '100%' }}>
        <TextInput
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message here... / for predefined text"
        />
        {suggestions.length > 0 && (
          <SuggestionsContainer>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </SuggestionItem>
            ))}
          </SuggestionsContainer>
        )}
      </div>
      <SendButton onClick={handleSend} disabled={!message.trim()}>
        Send
      </SendButton>
    </InputContainer>
  );
};

export default MessageInput;
