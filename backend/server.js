require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongo = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authroutes.js");
const distanceRoutes = require("./routes/distanceroute.js");
const cartRoutes = require("./routes/cartroute.js");
const messageRoutes = require("./routes/messageroute.js");
const productRoutes = require("./routes/productroute.js");
const shopRoutes = require("./routes/shoproutes.js");
const trackRoutes = require("./routes/trackroutes.js");
const transportRoutes = require("./routes/transportroute.js");
const user_detail = require("./routes/detail");

dotenv.config();

const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["https://agrinovafrontend.vercel.app"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`➡️ User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    console.log(`⬅️ User ${socket.id} left room: ${roomId}`);
  });

  socket.on("typing", ({ roomId, userId }) => {
    socket.to(roomId).emit("typing", { userId });
  });

  socket.on("stop_typing", ({ roomId, userId }) => {
    socket.to(roomId).emit("stop_typing", { userId });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

mongo
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected..."))
  .catch((e) => console.error("Mongo error:", e));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://agrinovafrontend.vercel.app"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("AgriNova Backend Running");
});
app.use("/api/",(req,res)=>{
  res.send("running !!!");
})
app.use("/api/auth", authRoutes);
app.use("/api/pincode", distanceRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/product", productRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/track", trackRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/user_detail", user_detail);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});

module.exports = app;