import React from 'react'
import ChatbotIcon from './ChatbotIcon';

const ChatMessage = ({chat}) => {
  return (
    !chat.hideInChat && 
    (<div
      className={`message ${chat.role === "model" ? "bot" : "user"}_message ${
        chat.isError ? "error" : ""
      }`}
    >
      {chat.role === "model" && <ChatbotIcon />}
      <p className="message_text">{chat.text}</p>
    </div>)
  );
}

export default ChatMessage
