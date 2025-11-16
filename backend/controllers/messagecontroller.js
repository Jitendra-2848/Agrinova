const Message = require( "../models/message.js");

 const getMessages = async (req, res) => {
  try {
    const { vendor, farmer } = req.body;

    if (!vendor || !farmer) {
      return res.status(400).json({ message: "vendor and farmer required" });
    }

    const data = await Message.findOne({
      "user.vendor": vendor,
      "user.farmer": farmer,
    });

    if (!data)
      return res.status(200).json({ conversation: { message: [] } });

    return res.status(200).json({ conversation: data });
  } catch (error) {
    console.error("getMessages error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

 const sendMessage = async (req, res) => {
  try {
    const { vendor, farmer, role, content, bargain } = req.body;

    if (!vendor || !farmer || !role || !content)
      return res.status(400).json({ message: "All fields required" });

    const newMessageObj = { role, content, bargain: bargain || {} };

    let chat = await Message.findOne({
      "user.vendor": vendor,
      "user.farmer": farmer,
    });

    if (!chat) {
      chat = await Message.create({
        user: { vendor, farmer },
        message: [newMessageObj],
      });
    } else {
      chat.message.push(newMessageObj);
      await chat.save();
    }

    return res.status(200).json({ message: "Message sent", conversation: chat });
  } catch (error) {
    console.error("sendMessage error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
} 
