import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import People from "./People";
import { useAuthStore } from "../../lib/store";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import {
  Send,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Paperclip,
  Smile,
  X,
  Check,
  Clock,
  Tag,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";

const SOCKET_URL = "http://localhost:5000";

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    sendmsg,
    sendOffer,
    respondToOffer,
    currentChatuser,
    Chats,
    AuthUser,
    Authtype,
    Allchatdel,
    activeOffers,
    acceptedOffers,
    getmsg,
    startChatWithUser,
    negotiation_product,
    setNegotiatedDeal,
    setCurrentChatUser,
    getProductsByFarmer,
  } = useAuthStore();

  // Get farmer and product from URL params
  const farmerIdFromUrl = searchParams.get("farmer");
  const productIdFromUrl = searchParams.get("product");

  const [msg, setMsg] = useState([]);
  const [offers, setOffers] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [message, setMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showBargainModal, setShowBargainModal] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false); // ✅ Track init

  // Bargain form state
  const [bargainProduct, setBargainProduct] = useState(null);
  const [bargainPrice, setBargainPrice] = useState("");
  const [bargainQuantity, setBargainQuantity] = useState(1);
  const [farmerProducts, setFarmerProducts] = useState([]);

  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  const menuRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // ✅ FIXED: Auto-start chat if farmer ID is in URL
  useEffect(() => {
    const initChat = async () => {
      // Only run if we have farmer ID and user is authenticated
      if (!farmerIdFromUrl || !AuthUser?._id) {
        console.log("Missing farmerIdFromUrl or AuthUser");
        return;
      }

      // Prevent multiple initializations
      if (chatInitialized) {
        console.log("Chat already initialized");
        return;
      }

      setIsLoading(true);
      console.log("Initializing chat with farmer:", farmerIdFromUrl);

      try {
        const user = await startChatWithUser(farmerIdFromUrl);
        
        if (user) {
          console.log("Chat user set successfully:", user);
          setChatInitialized(true);
          setShowMobileChat(true);

          // If we have a negotiation product, set it for bargaining
          if (negotiation_product) {
            console.log("Setting bargain product:", negotiation_product);
            setBargainProduct(negotiation_product);
            setBargainPrice(
              Math.round(negotiation_product.Product_price * 0.9).toString()
            );
            // Auto-open bargain modal after a short delay
            setTimeout(() => setShowBargainModal(true), 800);
          }
        } else {
          console.error("Failed to get user data");
          toast.error("Failed to start chat. User not found.");
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to start chat");
      } finally {
        setIsLoading(false);
      }
    };

    initChat();
  }, [farmerIdFromUrl, AuthUser?._id]); // ✅ Removed chatInitialized from deps

  // ✅ Set bargain product when negotiation_product changes (after chat is initialized)
  useEffect(() => {
    if (chatInitialized && negotiation_product && !bargainProduct) {
      console.log("Setting bargain product from negotiation_product");
      setBargainProduct(negotiation_product);
      setBargainPrice(
        Math.round(negotiation_product.Product_price * 0.9).toString()
      );
    }
  }, [chatInitialized, negotiation_product, bargainProduct]);

  // Fetch farmer products when chat user changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (currentChatuser?._id && Authtype === "vendor") {
        try {
          const products = await getProductsByFarmer(currentChatuser._id);
          setFarmerProducts(products || []);
        } catch (error) {
          console.error("Failed to fetch farmer products:", error);
          setFarmerProducts([]);
        }
      }
    };
    fetchProducts();
  }, [currentChatuser?._id, Authtype]);

  // Sync messages and offers from store
  useEffect(() => {
    if (Chats) setMsg(Chats);
    if (activeOffers) setOffers(activeOffers);
    if (acceptedOffers) setAccepted(acceptedOffers);
  }, [Chats, activeOffers, acceptedOffers]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  // Join socket room when chat user changes
  useEffect(() => {
    if (!currentChatuser || !AuthUser || !socketRef.current) return;

    const isVendor = Authtype === "vendor";
    const vendor = isVendor ? AuthUser._id : currentChatuser._id;
    const farmer = !isVendor ? AuthUser._id : currentChatuser._id;
    const roomId = `${vendor}_${farmer}`;

    socketRef.current.emit("join_room", roomId);
    console.log("Joined room:", roomId);

    setShowMobileChat(true);
  }, [currentChatuser, AuthUser, Authtype]);

  // Socket event listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("new_message", (data) => {
      console.log("New message received:", data);
      setMsg((prev) => {
        const exists = prev.some(
          (m) => m.createdAt === data.createdAt && m.content === data.content
        );
        if (exists) return prev;
        return [...prev, data];
      });
    });

    socket.on("new_offer", (data) => {
      console.log("New offer received:", data);
      setOffers((prev) => {
        const exists = prev.some((o) => o.offerId === data.offerId);
        if (exists) return prev;
        return [...prev, data];
      });
      toast.success("New offer received!");
    });

    socket.on("offer_updated", (data) => {
      console.log("Offer updated:", data);
      
      if (data.status === "accepted") {
        setOffers((prev) => prev.filter((o) => o.offerId !== data.offerId));
        setAccepted((prev) => {
          const exists = prev.some((o) => o.offerId === data.offerId);
          if (exists) return prev;
          return [...prev, data];
        });
        toast.success("Offer accepted!");
      } else {
        setOffers((prev) =>
          prev.map((o) => (o.offerId === data.offerId ? data : o))
        );
        
        if (data.status === "rejected") {
          toast("Offer rejected", { icon: "❌" });
        } else if (data.status === "countered") {
          toast.success("Counter offer received!");
        }
      }
    });

    socket.on("typing", ({ userId }) => {
      if (userId === currentChatuser?._id) {
        setIsTyping(true);
      }
    });

    socket.on("stop_typing", ({ userId }) => {
      if (userId === currentChatuser?._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("new_message");
      socket.off("new_offer");
      socket.off("offer_updated");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [currentChatuser]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle typing indicator
  const handleTyping = () => {
    if (!currentChatuser || !socketRef.current) return;

    const isVendor = Authtype === "vendor";
    const vendor = isVendor ? AuthUser._id : currentChatuser._id;
    const farmer = !isVendor ? AuthUser._id : currentChatuser._id;
    const roomId = `${vendor}_${farmer}`;

    socketRef.current.emit("typing", { roomId, userId: AuthUser._id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stop_typing", { roomId, userId: AuthUser._id });
    }, 2000);
  };

  // Send text message
  const handleSubmit = async () => {
    if (!message.trim()) {
      return;
    }
    
    if (!currentChatuser?._id) {
      toast.error("No chat user selected");
      return;
    }

    const isVendor = Authtype === "vendor";
    const vendor = isVendor ? AuthUser._id : currentChatuser._id;
    const farmer = !isVendor ? AuthUser._id : currentChatuser._id;

    try {
      await sendmsg({
        vendor,
        farmer,
        role: Authtype,
        content: message,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  // ✅ FIXED: Send bargain offer
  const handleSendOffer = async () => {
    console.log("=== handleSendOffer called ===");
    console.log("bargainProduct:", bargainProduct);
    console.log("bargainPrice:", bargainPrice);
    console.log("bargainQuantity:", bargainQuantity);
    console.log("currentChatuser:", currentChatuser);
    console.log("AuthUser:", AuthUser);

    // Validate bargain product
    if (!bargainProduct || !bargainProduct._id) {
      toast.error("Please select a product");
      return;
    }
    
    // Validate price
    if (!bargainPrice || Number(bargainPrice) <= 0) {
      toast.error("Please enter a valid offer price");
      return;
    }

    // Validate chat user
    if (!currentChatuser || !currentChatuser._id) {
      toast.error("No chat user selected. Please try again.");
      console.error("currentChatuser is missing:", currentChatuser);
      return;
    }

    // Validate auth user
    if (!AuthUser || !AuthUser._id) {
      toast.error("Please login to make an offer");
      return;
    }

    // Check if there's already an accepted offer for this product
    const alreadyAccepted = accepted.some((o) => {
      const offerProductId = o.productId?._id || o.productId;
      return offerProductId === bargainProduct._id;
    });
    
    if (alreadyAccepted) {
      toast.error("An offer for this product has already been accepted!");
      return;
    }

    const isVendor = Authtype === "vendor";
    const vendor = isVendor ? AuthUser._id : currentChatuser._id;
    const farmer = !isVendor ? AuthUser._id : currentChatuser._id;

    console.log("Sending offer with:", {
      vendor,
      farmer,
      role: Authtype,
      productId: bargainProduct._id,
      offeredPrice: Number(bargainPrice),
      quantity: bargainQuantity,
    });

    try {
      await sendOffer({
        vendor,
        farmer,
        role: Authtype,
        productId: bargainProduct._id,
        offeredPrice: Number(bargainPrice),
        quantity: bargainQuantity,
      });

      setShowBargainModal(false);
      setBargainProduct(null);
      setBargainPrice("");
      setBargainQuantity(1);
      toast.success("Offer sent successfully!");
    } catch (error) {
      console.error("Failed to send offer:", error);
      toast.error(error?.response?.data?.message || "Failed to send offer. Please try again.");
    }
  };

  // ... rest of the component (handleOfferResponse, handleProceedToPayment, etc.)
  
  // Respond to offer
  const handleOfferResponse = async (offerId, action, counterPrice = null) => {
    if (!currentChatuser?._id) {
      toast.error("Chat user not found");
      return;
    }

    const isVendor = Authtype === "vendor";
    const vendor = isVendor ? AuthUser._id : currentChatuser._id;
    const farmer = !isVendor ? AuthUser._id : currentChatuser._id;

    try {
      await respondToOffer({
        vendor,
        farmer,
        role: Authtype,
        offerId,
        action,
        counterPrice,
      });
    } catch (error) {
      console.error("Failed to respond to offer:", error);
      toast.error("Failed to respond to offer");
    }
  };

  // Handle proceeding to payment after offer acceptance
  const handleProceedToPayment = (offer) => {
    const product = farmerProducts.find(
      (p) => p._id === offer.productId || p._id === offer.productId?._id
    ) || negotiation_product;

    if (product) {
      setNegotiatedDeal(
        offer.counterPrice || offer.offeredPrice,
        offer.quantity,
        product
      );
      navigate("/buy");
    } else {
      toast.error("Product details not found");
    }
  };

  // Format time
  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if an offer is already accepted for this product
  const isOfferAcceptedForProduct = (productId) => {
    return accepted.some(
      (o) => o.productId === productId || o.productId?._id === productId
    );
  };

  // Render message
  const renderMessage = (item, index) => {
    const isMine = item.role === Authtype;

    if (item.messageType === "offer" || item.messageType === "offer_response") {
      const isAccepted = item.offer?.status === "accepted";
      const productAlreadyAccepted = isOfferAcceptedForProduct(
        item.offer?.productId || item.offer?.productId?._id
      );

      return (
        <div
          key={index}
          className={`flex ${isMine ? "justify-end" : "justify-start"} mb-4`}
        >
          <OfferCard
            offer={item.offer}
            isMine={isMine}
            onAccept={() => handleOfferResponse(item.offer.offerId, "accept")}
            onReject={() => handleOfferResponse(item.offer.offerId, "reject")}
            onCounter={(price) =>
              handleOfferResponse(item.offer.offerId, "counter", price)
            }
            onProceedToPayment={() => handleProceedToPayment(item.offer)}
            userRole={Authtype}
            productAlreadyAccepted={productAlreadyAccepted && !isAccepted}
          />
        </div>
      );
    }

    return (
      <div
        key={index}
        className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}
      >
        <div
          className={`max-w-[75%] ${
            isMine
              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl rounded-br-md"
              : "bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100"
          } px-4 py-2.5`}
        >
          <p className="text-sm leading-relaxed">{item.content}</p>
          <p
            className={`text-[10px] mt-1 text-right ${
              isMine ? "text-emerald-100" : "text-gray-400"
            }`}
          >
            {formatTime(item.createdAt)}
          </p>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - People List */}
      <div
        className={`${
          showMobileChat ? "hidden md:block" : "block"
        } w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white`}
      >
        <People onSelectUser={() => setShowMobileChat(true)} />
      </div>

      {/* Chat Area */}
      {currentChatuser ? (
        <div
          className={`${
            showMobileChat ? "flex" : "hidden md:flex"
          } flex-1 flex-col bg-gradient-to-b from-gray-50 to-gray-100`}
        >
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowMobileChat(false);
                  setChatInitialized(false);
                  navigate("/chat");
                }}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {currentChatuser.profile_pic ? (
                    <img
                      src={currentChatuser.profile_pic}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    currentChatuser.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 ${
                    isConnected ? "bg-green-500" : "bg-gray-400"
                  } border-2 border-white rounded-full`}
                ></span>
              </div>

              <div>
                <h2 className="font-semibold text-gray-900 capitalize">
                  {currentChatuser.name}
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  {isTyping ? (
                    <span className="text-emerald-600 font-medium">
                      Typing...
                    </span>
                  ) : (
                    <>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isConnected ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                      {currentChatuser.role === "farmer" ? "Farmer" : "Buyer"}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
                <Video className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {Authtype === "vendor" && (
                      <button
                        onClick={() => {
                          // ✅ Use negotiation_product if bargainProduct is not set
                          if (!bargainProduct && negotiation_product) {
                            setBargainProduct(negotiation_product);
                            setBargainPrice(
                              Math.round(negotiation_product.Product_price * 0.9).toString()
                            );
                          }
                          setShowBargainModal(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-3 transition-colors"
                      >
                        <Tag className="w-4 h-4" />
                        Make an Offer
                      </button>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        Allchatdel(currentChatuser._id);
                        setMsg([]);
                        setOffers([]);
                        setAccepted([]);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Delete Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Offers Banner */}
          {offers.filter((o) => o.status === "pending").length > 0 && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
              <div className="flex items-center gap-2 text-amber-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>
                  {offers.filter((o) => o.status === "pending").length} pending
                  offer(s)
                </span>
              </div>
            </div>
          )}

          {/* Accepted Offers Banner */}
          {accepted.length > 0 && (
            <div className="bg-green-50 border-b border-green-200 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <Check className="w-4 h-4" />
                  <span>{accepted.length} accepted offer(s)</span>
                </div>
                {Authtype === "vendor" && (
                  <button
                    onClick={() => handleProceedToPayment(accepted[0])}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Proceed to Buy
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Product Context Banner */}
          {negotiation_product && Authtype === "vendor" && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shadow">
                  {negotiation_product.Product_image ? (
                    <img
                      src={negotiation_product.Product_image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-emerald-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    Discussing: {negotiation_product.Product_name}
                  </p>
                  <p className="text-emerald-600 font-semibold">
                    ₹{negotiation_product.Product_price}/unit
                  </p>
                </div>
                {!isOfferAcceptedForProduct(negotiation_product._id) && (
                  <button
                    onClick={() => {
                      setBargainProduct(negotiation_product);
                      setBargainPrice(
                        Math.round(negotiation_product.Product_price * 0.9).toString()
                      );
                      setShowBargainModal(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Make Offer
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {msg.length > 0 ? (
              <>
                {msg.map((item, index) => renderMessage(item, index))}
                <div ref={chatEndRef} />
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Start a conversation
                </h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                  Say hello or make an offer to start negotiating with{" "}
                  {currentChatuser.name}
                </p>
                {Authtype === "vendor" && (
                  <button
                    onClick={() => {
                      if (negotiation_product) {
                        setBargainProduct(negotiation_product);
                        setBargainPrice(
                          Math.round(negotiation_product.Product_price * 0.9).toString()
                        );
                      }
                      setShowBargainModal(true);
                    }}
                    className="mt-4 px-6 py-2.5 bg-emerald-500 text-white rounded-full font-medium text-sm hover:bg-emerald-600 transition-colors flex items-center gap-2"
                  >
                    <Tag className="w-4 h-4" />
                    Make an Offer
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Smile className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">🌾</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              AgriNova Chat
            </h2>
            <p className="text-gray-500 max-w-sm">
              Connect with farmers, negotiate prices, and make deals directly
            </p>
          </div>
        </div>
      )}

      {/* Bargain Modal */}
      {showBargainModal && (
        <BargainModal
          onClose={() => setShowBargainModal(false)}
          onSubmit={handleSendOffer}
          bargainProduct={bargainProduct}
          setBargainProduct={setBargainProduct}
          bargainPrice={bargainPrice}
          setBargainPrice={setBargainPrice}
          bargainQuantity={bargainQuantity}
          setBargainQuantity={setBargainQuantity}
          currentChatuser={currentChatuser}
          preselectedProduct={negotiation_product}
          farmerProducts={farmerProducts}
          acceptedOffers={accepted}
        />
      )}
    </div>
  );
};

// ==================== OFFER CARD COMPONENT ====================
const OfferCard = ({
  offer,
  isMine,
  onAccept,
  onReject,
  onCounter,
  onProceedToPayment,
  userRole,
  productAlreadyAccepted,
}) => {
  const [showCounter, setShowCounter] = useState(false);
  const [counterPrice, setCounterPrice] = useState("");

  const getStatusColor = () => {
    switch (offer.status) {
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "countered":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "pending":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (offer.status) {
      case "accepted":
        return <Check className="w-3 h-3" />;
      case "rejected":
        return <X className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Only allow responding if:
  // 1. Status is pending
  // 2. The offer was made by the other party
  // 3. No offer for this product has been accepted yet
  const canRespond =
    offer.status === "pending" &&
    offer.offeredBy !== userRole &&
    !productAlreadyAccepted;

  return (
    <div
      className={`w-72 rounded-2xl overflow-hidden shadow-lg ${
        isMine
          ? "bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Product Header */}
      <div className="p-3 flex items-center gap-3 border-b border-gray-100 bg-white/50">
        {offer.productImage ? (
          <img
            src={offer.productImage}
            alt=""
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate text-sm">
            {offer.productName}
          </p>
          <p className="text-xs text-gray-500">Qty: {offer.quantity}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${getStatusColor()}`}
        >
          {getStatusIcon()}
          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
        </span>
      </div>

      {/* Price Details */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Original Price</span>
          <span className="text-gray-600 line-through">
            ₹{offer.originalPrice}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Offered Price</span>
          <span className="text-xl font-bold text-emerald-600">
            ₹{offer.offeredPrice}
          </span>
        </div>
        {offer.counterPrice && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Counter Price</span>
            <span className="text-xl font-bold text-amber-600">
              ₹{offer.counterPrice}
            </span>
          </div>
        )}
        <hr className="my-2" />
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Total</span>
          <span className="text-xl font-bold text-gray-900">
            ₹{(offer.counterPrice || offer.offeredPrice) * offer.quantity}
          </span>
        </div>
        <p className="text-xs text-gray-400 text-right">
          {Math.round(
            ((offer.originalPrice -
              (offer.counterPrice || offer.offeredPrice)) /
              offer.originalPrice) *
              100
          )}
          % discount
        </p>
      </div>

      {/* Already Accepted Warning */}
      {productAlreadyAccepted && offer.status === "pending" && (
        <div className="p-3 bg-yellow-50 border-t border-yellow-100">
          <p className="text-xs text-yellow-700 text-center">
            Another offer for this product has already been accepted
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {canRespond && (
        <div className="p-3 bg-gray-50 border-t border-gray-100">
          {!showCounter ? (
            <div className="flex gap-2">
              <button
                onClick={onReject}
                className="flex-1 py-2.5 px-3 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => setShowCounter(true)}
                className="flex-1 py-2.5 px-3 bg-amber-100 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-200 transition-colors"
              >
                Counter
              </button>
              <button
                onClick={onAccept}
                className="flex-1 py-2.5 px-3 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                Accept
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Your price"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <button
                  onClick={() => {
                    if (counterPrice) {
                      onCounter(Number(counterPrice));
                      setShowCounter(false);
                      setCounterPrice("");
                    }
                  }}
                  disabled={!counterPrice}
                  className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                >
                  Send
                </button>
              </div>
              <button
                onClick={() => {
                  setShowCounter(false);
                  setCounterPrice("");
                }}
                className="w-full py-2 text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Accepted - Proceed to Payment (Only for Vendor/Buyer) */}
      {offer.status === "accepted" && userRole === "vendor" && (
        <div className="p-3 bg-green-50 border-t border-green-100">
          <button
            onClick={onProceedToPayment}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Proceed to Payment - ₹
            {(offer.counterPrice || offer.offeredPrice) * offer.quantity}
          </button>
        </div>
      )}

      {/* Accepted - Confirmation for Farmer */}
      {offer.status === "accepted" && userRole === "farmer" && (
        <div className="p-3 bg-green-50 border-t border-green-100">
          <p className="text-center text-green-700 text-sm font-medium">
            ✓ Offer accepted - Waiting for buyer payment
          </p>
        </div>
      )}
    </div>
  );
};

// ==================== BARGAIN MODAL COMPONENT ====================
const BargainModal = ({
  onClose,
  onSubmit,
  bargainProduct,
  setBargainProduct,
  bargainPrice,
  setBargainPrice,
  bargainQuantity,
  setBargainQuantity,
  currentChatuser,
  preselectedProduct,
  farmerProducts,
  acceptedOffers,
}) => {
  // Combine farmer products with preselected product
  const products = preselectedProduct
    ? [preselectedProduct, ...farmerProducts.filter((p) => p._id !== preselectedProduct._id)]
    : farmerProducts;

  // Set preselected product
  useEffect(() => {
    if (preselectedProduct && !bargainProduct) {
      setBargainProduct(preselectedProduct);
      setBargainPrice(
        Math.round(preselectedProduct.Product_price * 0.9).toString()
      );
    }
  }, [preselectedProduct]);

  // Check if product already has accepted offer
  const isProductAccepted = (productId) => {
    return acceptedOffers?.some(
      (o) => o.productId === productId || o.productId?._id === productId
    );
  };

  const discount =
    bargainProduct && bargainPrice
      ? Math.round(
          ((bargainProduct.Product_price - bargainPrice) /
            bargainProduct.Product_price) *
            100
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Make an Offer</h3>
              <p className="text-sm text-emerald-100 mt-0.5">
                Negotiate with {currentChatuser?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Product
            </label>
            {products.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {products.map((product) => {
                  const isAccepted = isProductAccepted(product._id);
                  
                  return (
                    <div
                      key={product._id}
                      onClick={() => {
                        if (!isAccepted) {
                          setBargainProduct(product);
                          setBargainPrice(
                            Math.round(product.Product_price * 0.9).toString()
                          );
                        }
                      }}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        isAccepted
                          ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
                          : bargainProduct?._id === product._id
                          ? "border-emerald-500 bg-emerald-50 cursor-pointer"
                          : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {product.Product_image ? (
                          <img
                            src={product.Product_image}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-emerald-600" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {product.Product_name}
                          </p>
                          <p className="text-sm text-emerald-600 font-semibold">
                            ₹{product.Product_price}/unit
                          </p>
                          {isAccepted && (
                            <p className="text-xs text-red-500 mt-1">
                              Offer already accepted
                            </p>
                          )}
                        </div>
                        {bargainProduct?._id === product._id && !isAccepted && (
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center bg-gray-50 rounded-xl">
                <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No products available</p>
              </div>
            )}
          </div>

          {/* Quantity & Price */}
          {bargainProduct && !isProductAccepted(bargainProduct._id) && (
            <>
              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity (units)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setBargainQuantity(Math.max(1, bargainQuantity - 1))
                    }
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl text-gray-600 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={bargainQuantity}
                    onChange={(e) =>
                      setBargainQuantity(Math.max(1, Number(e.target.value)))
                    }
                    className="flex-1 text-center py-3 border-2 border-gray-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => setBargainQuantity(bargainQuantity + 1)}
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Available: {bargainProduct.Product_Qty} units
                </p>
              </div>

              {/* Offer Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Offer Price (per unit)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={bargainPrice}
                    onChange={(e) => setBargainPrice(e.target.value)}
                    placeholder="Enter your price"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-xl font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Original Price</span>
                  <span className="text-gray-700">
                    ₹{bargainProduct.Product_price} × {bargainQuantity}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Your Offer</span>
                  <span className="text-emerald-600 font-medium">
                    ₹{bargainPrice || 0} × {bargainQuantity}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded">
                      {discount}% OFF
                    </span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{(bargainPrice || 0) * bargainQuantity}
                  </span>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  You save ₹
                  {(bargainProduct.Product_price - (bargainPrice || 0)) *
                    bargainQuantity}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={
              !bargainProduct ||
              !bargainPrice ||
              bargainPrice <= 0 ||
              isProductAccepted(bargainProduct?._id)
            }
            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Tag className="w-5 h-5" />
            Send Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
// ==================== OFFER CARD COMPONENT ====================
// (Keep the same as before)

// ==================== BARGAIN MODAL COMPONENT ====================
// (Keep the same as before)