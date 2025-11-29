import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../lib/store";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  MessageCircle,
  Tag,
  MoreHorizontal,
} from "lucide-react";

const People = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const {
    getmsg,
    getpeople,
    getConversations,
    messageUser,
    conversations,
    AuthUser,
    Authtype,
    currentChatuser,
    setCurrentChatUser,
  } = useAuthStore();

  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch users on mount
  useEffect(() => {
    getpeople();
    if (AuthUser?._id && Authtype) {
      getConversations(Authtype);
    }
  }, [AuthUser?._id, Authtype]);

  // Filter based on search and user role
  useEffect(() => {
    if (!messageUser) {
      setFiltered([]);
      return;
    }

    // Filter to show only farmers for vendors and vice versa
    let relevantUsers = messageUser.filter((user) => {
      if (Authtype === "vendor") {
        return user.role === "farmer";
      } else if (Authtype === "farmer") {
        return user.role === "vendor";
      }
      return false;
    });

    if (search.trim()) {
      relevantUsers = relevantUsers.filter((p) =>
        p?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(relevantUsers);
  }, [search, messageUser, Authtype]);

  const openChat = async (user) => {
    await getmsg(user._id);
    setCurrentChatUser(user);
    onSelectUser?.();
  };

  const getLastMessage = (userId) => {
    const conv = conversations.find((c) => c.user?._id === userId);
    return conv?.lastMessage || "Start a conversation";
  };

  const getUnreadCount = (userId) => {
    const conv = conversations.find((c) => c.user?._id === userId);
    return conv?.unreadCount || 0;
  };

  const hasActiveOffer = (userId) => {
    const conv = conversations.find((c) => c.user?._id === userId);
    return conv?.hasActiveOffer || false;
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <p className="text-xs text-gray-500">
                {filtered.length}{" "}
                {Authtype === "vendor" ? "farmers" : "buyers"}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${
              Authtype === "vendor" ? "farmers" : "buyers"
            }...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Chats
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "offers"
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Offers
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {filtered.map((user) => {
              const isActive = currentChatuser?._id === user._id;
              const unread = getUnreadCount(user._id);
              const hasOffer = hasActiveOffer(user._id);

              return (
                <div
                  key={user._id}
                  onClick={() => openChat(user)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
                    isActive
                      ? "bg-emerald-50 border-l-4 border-emerald-500"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
                      {user.profile_pic ? (
                        <img
                          src={user.profile_pic}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-semibold text-gray-900 truncate capitalize">
                        {user.name}
                      </h3>
                      <span className="text-[11px] text-gray-400">
                        {formatTime(user.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate pr-2">
                        {getLastMessage(user._id)}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {hasOffer && (
                          <span className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
                            <Tag className="w-3 h-3 text-amber-600" />
                          </span>
                        )}
                        {unread > 0 && (
                          <span className="min-w-[20px] h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">No conversations</h3>
            <p className="text-sm text-gray-500">
              {search
                ? "No results found"
                : `Start chatting with ${
                    Authtype === "vendor" ? "farmers" : "buyers"
                  }`}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {Authtype === "vendor" && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => navigate("/products")}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Tag className="w-4 h-4" />
            Browse Products to Bargain
          </button>
        </div>
      )}
    </div>
  );
};

export default People;