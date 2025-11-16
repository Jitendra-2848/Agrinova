import React from "react";
import "./ChatBox.css";

const ChatBox = ({ messages }) => {
  return (
    <div className="chat-box">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.sender === "buyer" ? "buyer" : "seller"}`}
        >
          {msg.type === "offer" ? (
            <div>
              💰 <strong>Offer: ₹{msg.amount}</strong>
              <p>{msg.text}</p>
            </div>
          ) : (
            msg.text
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
