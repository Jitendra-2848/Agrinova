import React, { useEffect, useState, useRef } from "react";
import People from "./people";
import { useAuthStore } from "../../lib/store";
import { EllipsisVertical, Video, Smile } from "lucide-react";

const Homepage = () => {
  const { sendmsg, currentChatuser, Chats, AuthUser, Allchatdel } = useAuthStore();
  const [msg, setMsg] = useState(Chats);
  const [message, setMessage] = useState("");
  const [chatset, setChatset] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (Chats) setMsg(Chats);
  }, [Chats, currentChatuser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  const handleSubmit = async () => {
    if (!message.trim() || !currentChatuser?._id) return;

    const role = AuthUser.role; // AuthUser role
    const vendor = role === "vendor" ? AuthUser._id : currentChatuser._id;
    const farmer = role === "farmer" ? AuthUser._id : currentChatuser._id;

    const data = {
      vendor,
      farmer,
      role,
      content: message,
    };

    const res = await sendmsg(data);

    if (res?.conversation) {
      setMsg(res.conversation.message);
    } else {
      setMsg((prev) => [...prev, { ...data, createdAt: new Date() }]);
    }
    setMessage("");
  };

  return (
    <div className="flex h-[98vh] bg-base-100">
      <div className="w-[30%] hidden sm:block border-r border-base-300">
        <People />
      </div>

      {currentChatuser ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex justify-between items-center bg-green-100 border-b border-base-300 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-green-400 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  <span>{currentChatuser.username?.charAt(0)?.toUpperCase() || "?"}</span>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg capitalize">{currentChatuser.username}</h1>
                <p className="text-xs text-green-700">Active Chat</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative">
              <button className="btn btn-sm btn-ghost">
                <Smile className="w-5 h-5" />
              </button>
              <button className="btn btn-sm btn-ghost">
                <Video className="w-5 h-5" />
              </button>
              <button
                onClick={() => setChatset(!chatset)}
                className="btn btn-sm btn-ghost"
              >
                <EllipsisVertical className="w-5 h-5" />
              </button>
              {chatset && (
                <div className="menu bg-base-100 shadow-xl rounded-box absolute right-0 top-10 w-48 z-50">
                  <li className="menu-title text-base-content/70">Settings</li>
                  <li>
                    <button>Profile</button>
                  </li>
                  <li>
                    <button>Delete Messages</button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        Allchatdel(currentChatuser._id);
                        setMsg([]);
                      }}
                    >
                      Delete Chat
                    </button>
                  </li>
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {msg.length > 0 ? (
              msg.map((item, index) => {
                const isMine = item.role === AuthUser.role;
                return (
                  <div key={index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`chat max-w-md ${isMine ? "chat-end" : "chat-start"}`}>
                      <div className={`chat-bubble ${isMine ? "chat-bubble-primary" : "chat-bubble-secondary"}`}>
                        {item.content}
                      </div>
                      <div className="chat-footer text-xs opacity-50 mt-1 text-right">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-base-content/60 mt-4">No messages yet 💬</p>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Message Input */}
          <div className="bg-green-50 border-t border-base-300 p-3 flex gap-2">
            <input
              type="text"
              className="focus:outline-green-400 border-2 px-3 py-2 flex-1 rounded-lg"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              className="bg-green-500 px-6 py-2 text-white text-lg rounded-lg hover:bg-green-600 transition"
              onClick={handleSubmit}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <h1 className="text-4xl font-semibold text-base-content/50">
            Start chatting now!
          </h1>
        </div>
      )}
    </div>
  );
};

export default Homepage;
