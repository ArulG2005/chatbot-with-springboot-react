// src/App.js
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import { ClipLoader } from 'react-spinners';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  width: 100%;
`;

const ChatContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  flex-grow: 1;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const predefinedResponses = {
  "Library Hours": "Library Hours:\n- Weekdays: 9 AM to 9 PM\n- Saturdays: 10 AM to 6 PM\n- Sundays: 12 PM to 5 PM",
  "Total Books": "The library has a total of 20,000 books.",
  "Total Journals": "The library has a total of 5,000 journals.",
  "List of Journals": "List of Journals:\n- Science\n- Technology\n- Arts\n- Literature",
  "Late Fee Amount": "The late fee is $0.50 per day.",
  "Membership Fee": "The membership fee is $25 per year.",
  "Borrowing Limits": "You can borrow up to 5 books at a time.",
  "Reservation System": "Reservation System:\n- Books\n- Study rooms\n- Computers",
  "Library Services": "Library Services:\n- Interlibrary loans\n- Photocopying\n- Printing",
  "Special Collections": "Special Collections:\n- Local history\n- Rare books"
};

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    const userMessage = { sender: 'user', text: message };
    setMessages([...messages, userMessage]);
    setLoading(true);

    if (predefinedResponses[message]) {
      const botMessage = { sender: 'bot', text: predefinedResponses[message] };
      setMessages([...messages, userMessage, botMessage]);
      setLoading(false);
    } else {
      try {
        const response = await axios.post('http://localhost:8080/api/chat', { message });
        const botMessage = { sender: 'bot', text: response.data.response };
        setMessages([...messages, userMessage, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = { sender: 'bot', text: 'Error: Unable to get response from the server.' };
        setMessages([...messages, userMessage, errorMessage]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AppContainer>
      <ChatContainer>
        <ChatWindow messages={messages} />
        {loading && (
          <LoaderContainer>
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
          </LoaderContainer>
        )}
      </ChatContainer>
      <MessageInput onSend={sendMessage} />
    </AppContainer>
  );
}

export default App;
