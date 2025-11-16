import React, { useState } from "react";
import "./BargainPanel.css";

const BargainPanel = ({ onSend }) => {
  const [text, setText] = useState("");
  const [offer, setOffer] = useState("");

  const handleSendText = () => {
    if (!text.trim()) return;
    onSend({ sender: "buyer", text, type: "text" });
    setText("");
  };

  const handleOffer = () => {
    if (!offer.trim()) return;
    onSend({
      sender: "buyer",
      text: "I’d like to offer this price",
      type: "offer",
      amount: offer,
    });
    setOffer("");
  };

  return (
    <div className="bargain-panel">
      <div className="input-row">
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSendText}>Send</button>
      </div>

      <div className="input-row">
        <input
          type="number"
          placeholder="Enter your offer (₹)"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
        />
        <button className="offer-btn" onClick={handleOffer}>
          Offer
        </button>
      </div>
    </div>
  );
};

export default BargainPanel;
