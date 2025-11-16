import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../lib/store";
import { useNavigate } from "react-router-dom";

const People = () => {
  const { getmsg, messageUser } = useAuthStore();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFiltered(messageUser || []);
  }, [messageUser]);

  useEffect(() => {
    if (!search.trim()) setFiltered(messageUser || []);
    else setFiltered(messageUser.filter(p => p.username.toLowerCase().includes(search.toLowerCase())));
  }, [search, messageUser]);

  return (
    <div className="h-full flex flex-col bg-green-50 border-r border-base-300">
      <div className="bg-green-200 border-b flex justify-between items-center py-3 px-4">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>🔙</h1>
        <h1 className="text-lg font-semibold">Chats 💬</h1>
      </div>

      <div className="p-3">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered w-full px-3 py-2 rounded-lg input-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-y-auto flex-1 px-3 space-y-2">
        {filtered.length > 0 ? (
          filtered.map((item, index) => (
            <div
              key={index}
              onClick={() => getmsg(item._id)}
              className="flex items-center gap-3 p-3 hover:bg-green-200 rounded-md cursor-pointer transition"
            >
              <div className="avatar placeholder">
                <div className="bg-green-400 text-white w-12 h-12 rounded-full flex items-center justify-center">
                  {item.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="capitalize font-semibold">{item.username}</p>
                  <p className="text-xs opacity-50">Today</p>
                </div>
                <p className="text-sm text-green-700 opacity-70">Start Chat</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-base-content/70 py-5">No matches found 😢</p>
        )}
      </div>
    </div>
  );
};

export default People;
