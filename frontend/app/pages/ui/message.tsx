import React from 'react';

interface MessageProps {
  message: string;
  sender: string;
}

const Message: React.FC<MessageProps> = ({ message, sender }) => {
  return (
    <div className={`message ${sender === 'Imam' ? 'imam-message' : 'user-message'}`}>
      <strong>{sender}: </strong>{message}
    </div>
  );
};

export default Message;
