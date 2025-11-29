const Message = require("../models/message.js");
const Product = require("../models/product.js");
const User = require("../models/user.js");
const { v4: uuidv4 } = require('uuid');

// Get all messages between two users
const getMessages = async (req, res) => {
  try {
    const { odId } = req.body;
    const userId = req.user;

    // Find user to determine role
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRole = currentUser.role;

    const conversation = await Message.findOne({
      $or: [
        { "user.vendor": userId, "user.farmer": odId },
        { "user.vendor": odId, "user.farmer": userId }
      ]
    });

    if (!conversation) {
      return res.status(200).json({ 
        messages: [], 
        activeOffers: [],
        acceptedOffers: []
      });
    }

    // Mark messages as read
    if (userRole === "vendor") {
      conversation.unreadVendor = 0;
    } else {
      conversation.unreadFarmer = 0;
    }
    await conversation.save();

    // Separate pending and accepted offers
    const pendingOffers = conversation.activeOffers.filter(o => o.status === "pending");
    const acceptedOffers = conversation.activeOffers.filter(o => o.status === "accepted");

    return res.status(200).json({
      messages: conversation.messages,
      activeOffers: pendingOffers,
      acceptedOffers: acceptedOffers
    });
  } catch (error) {
    console.error("getMessages error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Send a text message
const sendMessage = async (req, res) => {
  try {
    const { vendor, farmer, role, content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Message content required" });
    }

    const newMessage = {
      role,
      content,
      messageType: "text",
      createdAt: new Date()
    };

    let conversation = await Message.findOne({
      "user.vendor": vendor,
      "user.farmer": farmer
    });

    if (!conversation) {
      conversation = new Message({
        user: { vendor, farmer },
        messages: [newMessage],
        lastMessage: new Date()
      });
    } else {
      conversation.messages.push(newMessage);
      conversation.lastMessage = new Date();
    }

    // Update unread count
    if (role === "vendor") {
      conversation.unreadFarmer += 1;
    } else {
      conversation.unreadVendor += 1;
    }

    await conversation.save();

    // Emit via socket
    const io = req.app.get("io");
    const roomId = `${vendor}_${farmer}`;
    io.to(roomId).emit("new_message", newMessage);

    return res.status(200).json(newMessage);
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Send a bargain/offer
const sendOffer = async (req, res) => {
  try {
    const { vendor, farmer, role, productId, offeredPrice, quantity } = req.body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if there's already an accepted offer for this product in this conversation
    let conversation = await Message.findOne({
      "user.vendor": vendor,
      "user.farmer": farmer
    });

    if (conversation) {
      const existingAccepted = conversation.activeOffers.find(
        o => o.productId.toString() === productId && o.status === "accepted"
      );
      
      if (existingAccepted) {
        return res.status(400).json({ 
          message: "An offer for this product has already been accepted" 
        });
      }
    }

    const offerId = uuidv4();
    const offer = {
      offerId,
      productId,
      productName: product.Product_name,
      productImage: product.Product_image || "",
      originalPrice: product.Product_price,
      offeredPrice,
      quantity,
      status: "pending",
      offeredBy: role,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    const offerMessage = {
      role,
      content: `Made an offer of ₹${offeredPrice} for ${quantity} units of ${product.Product_name}`,
      messageType: "offer",
      offer,
      createdAt: new Date()
    };

    if (!conversation) {
      conversation = new Message({
        user: { vendor, farmer },
        messages: [offerMessage],
        activeOffers: [offer],
        lastMessage: new Date()
      });
    } else {
      conversation.messages.push(offerMessage);
      conversation.activeOffers.push(offer);
      conversation.lastMessage = new Date();
    }

    // Update unread count
    if (role === "vendor") {
      conversation.unreadFarmer += 1;
    } else {
      conversation.unreadVendor += 1;
    }

    await conversation.save();

    // Emit via socket
    const io = req.app.get("io");
    const roomId = `${vendor}_${farmer}`;
    io.to(roomId).emit("new_message", offerMessage);
    io.to(roomId).emit("new_offer", offer);

    return res.status(200).json({ message: offerMessage, offer });
  } catch (error) {
    console.error("sendOffer error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Respond to an offer (accept/reject/counter)
const respondToOffer = async (req, res) => {
  try {
    const { vendor, farmer, role, offerId, action, counterPrice } = req.body;

    const conversation = await Message.findOne({
      "user.vendor": vendor,
      "user.farmer": farmer
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const offerIndex = conversation.activeOffers.findIndex(o => o.offerId === offerId);
    if (offerIndex === -1) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const offer = conversation.activeOffers[offerIndex];

    // Check if someone already accepted an offer for this product
    if (action === "accept") {
      const existingAccepted = conversation.activeOffers.find(
        o => o.productId.toString() === offer.productId.toString() && 
            o.status === "accepted" &&
            o.offerId !== offerId
      );
      
      if (existingAccepted) {
        return res.status(400).json({ 
          message: "An offer for this product has already been accepted" 
        });
      }
    }

    let responseMessage;
    let updatedOffer = { ...offer.toObject() };

    switch (action) {
      case "accept":
        updatedOffer.status = "accepted";
        updatedOffer.respondedAt = new Date();
        
        // Reject all other pending offers for the same product
        conversation.activeOffers.forEach((o, idx) => {
          if (o.productId.toString() === offer.productId.toString() && 
              o.status === "pending" && 
              o.offerId !== offerId) {
            conversation.activeOffers[idx].status = "rejected";
            conversation.activeOffers[idx].respondedAt = new Date();
          }
        });
        
        responseMessage = {
          role,
          content: `Accepted the offer of ₹${offer.counterPrice || offer.offeredPrice} for ${offer.quantity} ${offer.productName}`,
          messageType: "offer_response",
          offer: updatedOffer,
          createdAt: new Date()
        };
        break;

      case "reject":
        updatedOffer.status = "rejected";
        updatedOffer.respondedAt = new Date();
        responseMessage = {
          role,
          content: `Rejected the offer for ${offer.productName}`,
          messageType: "offer_response",
          offer: updatedOffer,
          createdAt: new Date()
        };
        break;

      case "counter":
        if (!counterPrice) {
          return res.status(400).json({ message: "Counter price required" });
        }
        updatedOffer.status = "countered";
        updatedOffer.counterPrice = counterPrice;
        updatedOffer.respondedAt = new Date();
        
        // Create new pending offer with counter price
        const newOffer = {
          offerId: uuidv4(),
          productId: offer.productId,
          productName: offer.productName,
          productImage: offer.productImage,
          originalPrice: offer.originalPrice,
          offeredPrice: counterPrice,
          quantity: offer.quantity,
          status: "pending",
          offeredBy: role,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };

        conversation.activeOffers.push(newOffer);

        responseMessage = {
          role,
          content: `Counter offered ₹${counterPrice} for ${offer.quantity} ${offer.productName}`,
          messageType: "offer",
          offer: newOffer,
          createdAt: new Date()
        };

        // Emit new offer
        const io2 = req.app.get("io");
        const roomId2 = `${vendor}_${farmer}`;
        io2.to(roomId2).emit("new_offer", newOffer);
        break;

      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    // Update the original offer
    conversation.activeOffers[offerIndex] = updatedOffer;
    conversation.messages.push(responseMessage);
    conversation.lastMessage = new Date();

    // Update unread count
    if (role === "vendor") {
      conversation.unreadFarmer += 1;
    } else {
      conversation.unreadVendor += 1;
    }

    await conversation.save();

    // Emit via socket
    const io = req.app.get("io");
    const roomId = `${vendor}_${farmer}`;
    io.to(roomId).emit("new_message", responseMessage);
    io.to(roomId).emit("offer_updated", updatedOffer);

    return res.status(200).json({ message: responseMessage, offer: updatedOffer });
  } catch (error) {
    console.error("respondToOffer error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all conversations for a user
const getConversations = async (req, res) => {
  try {
    const userId = req.user;
    const { role } = req.body;

    const query = role === "vendor" 
      ? { "user.vendor": userId }
      : { "user.farmer": userId };

    const conversations = await Message.find(query)
      .populate("user.vendor", "name email profile_pic role")
      .populate("user.farmer", "name email profile_pic role")
      .sort({ lastMessage: -1 });

    const formattedConversations = conversations.map(conv => {
      const otherUser = role === "vendor" ? conv.user.farmer : conv.user.vendor;
      const lastMsg = conv.messages[conv.messages.length - 1];
      const unreadCount = role === "vendor" ? conv.unreadVendor : conv.unreadFarmer;

      return {
        id: conv._id,
        user: otherUser,
        lastMessage: lastMsg?.content || "Start a conversation",
        lastMessageTime: conv.lastMessage,
        unreadCount,
        hasActiveOffer: conv.activeOffers.some(o => o.status === "pending")
      };
    });

    return res.status(200).json(formattedConversations);
  } catch (error) {
    console.error("getConversations error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete all messages in a conversation
const deleteChat = async (req, res) => {
  try {
    const { odId } = req.body;
    const userId = req.user;

    await Message.findOneAndUpdate(
      {
        $or: [
          { "user.vendor": userId, "user.farmer": odId },
          { "user.vendor": odId, "user.farmer": userId }
        ]
      },
      { messages: [], activeOffers: [] }
    );

    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("deleteChat error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  sendOffer,
  respondToOffer,
  getConversations,
  deleteChat,
  getUserById
};