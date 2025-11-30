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

// Safe number helper
const safeNumber = (val, fallback = 0) => {
  const num = Number(val);
  return isNaN(num) ? fallback : num;
};

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

  // Get farmer from URL params
  const farmerIdFromUrl = searchParams.get("farmer");

  // State
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
  const [chatInitialized, setChatInitialized] = useState(false);

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
    socketRef.current = io(SOCKET_URL, { withCredentials: true });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Auto-start chat from URL
  useEffect(() => {
    const initChat = async () => {
      if (!farmerIdFromUrl || !AuthUser?._id) return;
      if (chatInitialized) return;

      setIsLoading(true);
      try {
        const user = await startChatWithUser(farmerIdFromUrl);
        if (user) {
          setChatInitialized(true);
          setShowMobileChat(true);

          // Open bargain modal if we have a product
          if (negotiation_product) {
            setBargainProduct(negotiation_product);
            const price = safeNumber(negotiation_product.Product_price, 0);
            setBargainPrice(Math.round(price * 0.9).toString());
            setTimeout(() => setShowBargainModal(true), 800);
          }
        } else {
          toast.error("Failed to start chat. User not found.");
        }
      } catch (error) {
        console.error("Chat init error:", error);
        toast.error("Failed to start chat");
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, [farmerIdFromUrl, AuthUser?._id]);

  // Set bargain product when negotiation_product changes
  useEffect(() => {
    if (chatInitialized && negotiation_product && !bargainProduct) {
      setBargainProduct(negotiation_product);
      const price = safeNumber(negotiation_product.Product_price, 0);
      setBargainPrice(Math.round(price * 0.9).toString());
    }
  }, [chatInitialized, negotiation_product, bargainProduct]);

  // Fetch farmer products
  useEffect(() => {
    const fetchProducts = async () => {
      if (currentChatuser?._id && Authtype === "vendor" && getProductsByFarmer) {
        try {
          const products = await getProductsByFarmer(currentChatuser._id);
          setFarmerProducts(products || []);
        } catch (error) {
          setFarmerProducts([]);
        }
      }
    };
    fetchProducts();
  }, [currentChatuser?._id, Authtype]);

  // Sync data from store
  useEffect(() => {
    if (Chats) setMsg(Chats);
    if (activeOffers) setOffers(activeOffers);
    if (acceptedOffers) setAccepted(acceptedOffers);
  }, [Chats, activeOffers, acceptedOffers]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  // Socket Join Room
  useEffect(() => {
    if (!currentChatuser || !AuthUser || !socketRef.current) return;
    const isVendor = Authtype === "vendor";
    const vendor = isVendor ? AuthUser._id : currentChatuser._id;
    const farmer = !isVendor ? AuthUser._id : currentChatuser._id;
    const roomId = `${vendor}_${farmer}`;

    socketRef.current.emit("join_room", roomId);
    setShowMobileChat(true);
  }, [currentChatuser, AuthUser, Authtype]);

  // Socket Listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleNewMessage = (data) => {
      setMsg((prev) => {
        const exists = prev.some(
          (m) => m.createdAt === data.createdAt && m.content === data.content
        );
        return exists ? prev : [...prev, data];
      });
    };

    const handleNewOffer = (data) => {
      setOffers((prev) => {
        const exists = prev.some((o) => o.offerId === data.offerId);
        return exists ? prev : [...prev, data];
      });
      toast.success("New offer received!");
    };

    const handleOfferUpdated = (data) => {
      if (data.status === "accepted") {
        setOffers((prev) => prev.filter((o) => o.offerId !== data.offerId));
        setAccepted((prev) => {
          const exists = prev.some((o) => o.offerId === data.offerId);
          return exists ? prev : [...prev, data];
        });
        toast.success("Offer accepted!");
      } else {
        setOffers((prev) =>
          prev.map((o) => (o.offerId === data.offerId ? data : o))
        );
        if (data.status === "rejected") toast("Offer rejected", { icon: "❌" });
        else if (data.status === "countered")
          toast.success("Counter offer received!");
      }
    };

    const handleTypingEvent = ({ userId }) => {
      if (userId === currentChatuser?._id) setIsTyping(true);
    };

    const handleStopTyping = ({ userId }) => {
      if (userId === currentChatuser?._id) setIsTyping(false);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("new_offer", handleNewOffer);
    socket.on("offer_updated", handleOfferUpdated);
    socket.on("typing", handleTypingEvent);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("new_offer", handleNewOffer);
      socket.off("offer_updated", handleOfferUpdated);
      socket.off("typing", handleTypingEvent);
      socket.off("stop_typing", handleStopTyping);
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

  // Typing Logic
  const handleTyping = () => {
    if (!currentChatuser || !socketRef.current) return;
    const isVendor = Authtype === "vendor";
    const roomId = `${isVendor ? AuthUser._id : currentChatuser._id}_${
      !isVendor ? AuthUser._id : currentChatuser._id
    }`;

    socketRef.current.emit("typing", { roomId, userId: AuthUser._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stop_typing", { roomId, userId: AuthUser._id });
    }, 2000);
  };

  // Send Message
  const handleSubmit = async () => {
    if (!message.trim() || !currentChatuser?._id) return;

    const isVendor = Authtype === "vendor";
    try {
      await sendmsg({
        vendor: isVendor ? AuthUser._id : currentChatuser._id,
        farmer: !isVendor ? AuthUser._id : currentChatuser._id,
        role: Authtype,
        content: message,
      });
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  // Send Offer
  const handleSendOffer = async () => {
    if (!bargainProduct?._id) return toast.error("Please select a product");

    const safePrice = safeNumber(bargainPrice, 0);
    if (safePrice <= 0) return toast.error("Please enter a valid offer price");
    if (!currentChatuser?._id) return toast.error("No chat user selected");

    // Check duplicate offer
    const alreadyAccepted = accepted.some((o) => {
      const pid = o.productId?._id || o.productId;
      return pid === bargainProduct._id;
    });
    if (alreadyAccepted)
      return toast.error("Offer already accepted for this product!");

    const isVendor = Authtype === "vendor";
    try {
      await sendOffer({
        vendor: isVendor ? AuthUser._id : currentChatuser._id,
        farmer: !isVendor ? AuthUser._id : currentChatuser._id,
        role: Authtype,
        productId: bargainProduct._id,
        offeredPrice: safePrice,
        quantity: safeNumber(bargainQuantity, 1),
      });

      setShowBargainModal(false);
      setBargainProduct(null);
      setBargainPrice("");
      setBargainQuantity(1);
      toast.success("Offer sent successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send offer");
    }
  };

  // Respond to Offer
  const handleOfferResponse = async (offerId, action, counterPrice = null) => {
    if (!currentChatuser?._id) return toast.error("Chat user not found");
    const isVendor = Authtype === "vendor";
    try {
      await respondToOffer({
        vendor: isVendor ? AuthUser._id : currentChatuser._id,
        farmer: !isVendor ? AuthUser._id : currentChatuser._id,
        role: Authtype,
        offerId,
        action,
        counterPrice: counterPrice ? safeNumber(counterPrice, 0) : null,
      });
    } catch (error) {
      toast.error("Failed to respond to offer");
    }
  };

  // Proceed to Payment
  const handleProceedToPayment = (offer) => {
    const product =
      farmerProducts.find(
        (p) => p._id === (offer.productId?._id || offer.productId)
      ) || negotiation_product;

    if (product) {
      const finalPrice =
        safeNumber(offer.counterPrice, 0) || safeNumber(offer.offeredPrice, 0);
      const qty = safeNumber(offer.quantity, 1);

      if (setNegotiatedDeal) {
        setNegotiatedDeal(finalPrice, qty, product);
      }
      navigate("/buy");
    } else {
      toast.error("Product details not found");
    }
  };

  // Helpers
  const formatTime = (date) =>
    date
      ? new Date(date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const isOfferAcceptedForProduct = (productId) =>
    accepted.some(
      (o) => o.productId === productId || o.productId?._id === productId
    );

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
      {/* Sidebar */}
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
          {/* Header */}
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
                <p className="text-xs text-gray-500">
                  {isTyping ? (
                    <span className="text-emerald-600 font-medium">
                      Typing...
                    </span>
                  ) : currentChatuser.role === "farmer" ? (
                    "Farmer"
                  ) : (
                    "Buyer"
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
                          if (!bargainProduct && negotiation_product) {
                            setBargainProduct(negotiation_product);
                            const price = safeNumber(
                              negotiation_product.Product_price,
                              0
                            );
                            setBargainPrice(Math.round(price * 0.9).toString());
                          }
                          setShowBargainModal(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-3 transition-colors"
                      >
                        <Tag className="w-4 h-4" /> Make an Offer
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
                      <X className="w-4 h-4" /> Delete Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pending Offers Banner */}
          {offers.filter((o) => o.status === "pending").length > 0 && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>
                {offers.filter((o) => o.status === "pending").length} pending
                offer(s)
              </span>
            </div>
          )}

          {/* Accepted Offers Banner */}
          {accepted.length > 0 && (
            <div className="bg-green-50 border-b border-green-200 px-4 py-2 flex items-center justify-between">
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
          )}

          {/* Product Context Banner */}
          {negotiation_product && Authtype === "vendor" && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3 flex items-center gap-3">
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
                  {negotiation_product.Product_name}
                </p>
                <p className="text-emerald-600 font-semibold">
                  ₹{safeNumber(negotiation_product.Product_price, 0)}/unit
                </p>
              </div>
              {!isOfferAcceptedForProduct(negotiation_product._id) && (
                <button
                  onClick={() => {
                    setBargainProduct(negotiation_product);
                    const price = safeNumber(
                      negotiation_product.Product_price,
                      0
                    );
                    setBargainPrice(Math.round(price * 0.9).toString());
                    setShowBargainModal(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Make Offer
                </button>
              )}
            </div>
          )}

          {/* Messages */}
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
                          Math.round(
                            safeNumber(negotiation_product.Product_price, 0) *
                              0.9
                          ).toString()
                        );
                      }
                      setShowBargainModal(true);
                    }}
                    className="mt-4 px-6 py-2.5 bg-emerald-500 text-white rounded-full font-medium text-sm hover:bg-emerald-600 transition-colors flex items-center gap-2"
                  >
                    <Tag className="w-4 h-4" /> Make an Offer
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Input */}
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

  // Safe calculations
  const originalPrice = safeNumber(offer.originalPrice, 0);
  const offeredPrice = safeNumber(offer.offeredPrice, 0);
  const counterPriceVal = safeNumber(offer.counterPrice, 0);
  const activePrice = counterPriceVal > 0 ? counterPriceVal : offeredPrice;
  const quantity = safeNumber(offer.quantity, 1);
  const total = activePrice * quantity;

  const discountPercent =
    originalPrice > 0
      ? Math.round(((originalPrice - activePrice) / originalPrice) * 100)
      : 0;

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
            {offer.productName || "Product"}
          </p>
          <p className="text-xs text-gray-500">Qty: {quantity}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${getStatusColor()}`}
        >
          {getStatusIcon()}
          {(offer.status || "pending").charAt(0).toUpperCase() +
            (offer.status || "pending").slice(1)}
        </span>
      </div>

      {/* Price Details */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Original Price</span>
          <span className="text-gray-600 line-through">₹{originalPrice}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Offered Price</span>
          <span className="text-xl font-bold text-emerald-600">
            ₹{offeredPrice}
          </span>
        </div>
        {counterPriceVal > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Counter Price</span>
            <span className="text-xl font-bold text-amber-600">
              ₹{counterPriceVal}
            </span>
          </div>
        )}
        <hr className="my-2" />
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Total</span>
          <span className="text-xl font-bold text-gray-900">₹{total}</span>
        </div>
        {discountPercent > 0 && (
          <p className="text-xs text-green-600 text-right font-medium">
            {discountPercent}% discount
          </p>
        )}
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
                    if (counterPrice && Number(counterPrice) > 0) {
                      onCounter(Number(counterPrice));
                      setShowCounter(false);
                      setCounterPrice("");
                    }
                  }}
                  disabled={!counterPrice || Number(counterPrice) <= 0}
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

      {/* Payment Button */}
      {offer.status === "accepted" && userRole === "vendor" && (
        <div className="p-3 bg-green-50 border-t border-green-100">
          <button
            onClick={onProceedToPayment}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Proceed to Payment - ₹{total}
          </button>
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
  const products = preselectedProduct
    ? [
        preselectedProduct,
        ...farmerProducts.filter((p) => p._id !== preselectedProduct._id),
      ]
    : farmerProducts;

  useEffect(() => {
    if (preselectedProduct && !bargainProduct) {
      setBargainProduct(preselectedProduct);
      const price = safeNumber(preselectedProduct.Product_price, 0);
      setBargainPrice(Math.round(price * 0.9).toString());
    }
  }, [preselectedProduct]);

  const isProductAccepted = (productId) =>
    acceptedOffers?.some(
      (o) => o.productId === productId || o.productId?._id === productId
    );

  // Safe calculations
  const safeProductPrice = safeNumber(bargainProduct?.Product_price, 0);
  const safeBargainPrice = safeNumber(bargainPrice, 0);
  const safeQty = safeNumber(bargainQuantity, 1);
  const maxQty = safeNumber(bargainProduct?.Product_Qty, 99);

  const discount =
    safeProductPrice > 0
      ? Math.round(
          ((safeProductPrice - safeBargainPrice) / safeProductPrice) * 100
        )
      : 0;

  const savings = Math.max(0, (safeProductPrice - safeBargainPrice) * safeQty);
  const total = safeBargainPrice * safeQty;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-white flex justify-between items-center">
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

        {/* Content */}
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
                          const p = safeNumber(product.Product_price, 0);
                          setBargainPrice(Math.round(p * 0.9).toString());
                        }
                      }}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        isAccepted
                          ? "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                          : bargainProduct?._id === product._id
                          ? "border-emerald-500 bg-emerald-50 cursor-pointer"
                          : "border-gray-200 hover:border-emerald-300 cursor-pointer"
                      }`}
                    >
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
                          ₹{safeNumber(product.Product_price, 0)}/unit
                        </p>
                        {isAccepted && (
                          <p className="text-xs text-red-500">
                            Already accepted
                          </p>
                        )}
                      </div>
                      {bargainProduct?._id === product._id && !isAccepted && (
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
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
                      setBargainQuantity(Math.max(1, safeQty - 1))
                    }
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl text-gray-600 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={bargainQuantity}
                    onChange={(e) =>
                      setBargainQuantity(
                        Math.min(maxQty, Math.max(1, Number(e.target.value) || 1))
                      )
                    }
                    className="flex-1 text-center py-3 border-2 border-gray-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() =>
                      setBargainQuantity(Math.min(maxQty, safeQty + 1))
                    }
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Available: {maxQty} units
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
                    ₹{safeProductPrice} × {safeQty}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Your Offer</span>
                  <span className="text-emerald-600 font-medium">
                    ₹{safeBargainPrice} × {safeQty}
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
                    ₹{total}
                  </span>
                </div>
                {savings > 0 && (
                  <p className="text-xs text-green-600 text-center font-medium">
                    You save ₹{savings}
                  </p>
                )}
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
              safeNumber(bargainPrice, 0) <= 0 ||
              isProductAccepted(bargainProduct?._id)
            }
            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Tag className="w-5 h-5" /> Send Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;