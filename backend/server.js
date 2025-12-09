require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authroutes.js");
const distanceRoutes = require("./routes/distanceroute.js");
const cartRoutes = require("./routes/cartroute.js");
const messageRoutes = require("./routes/messageroute.js");
const productRoutes = require("./routes/productroute.js");
const shopRoutes = require("./routes/shoproutes.js");
const trackRoutes = require("./routes/trackroutes.js");
const transportRoutes = require("./routes/transportroute.js");
const user_detail = require("./routes/detail");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true }
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join_room", (roomId) => socket.join(roomId));
  socket.on("leave_room", (roomId) => socket.leave(roomId));
  socket.on("typing", (data) => socket.to(data.roomId).emit("typing", data));
  socket.on("stop_typing", (data) => socket.to(data.roomId).emit("stop_typing", data));
  socket.on("disconnect", () => {});
});

// Connect to MongoDB once at startup
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB error:", err.message));

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Reconnect middleware
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
      return res.status(500).json({ error: "DB connection failed" });
    }
  }
  next();
});

app.get("/", (req, res) => res.send("OK"));
app.get("/api/check", (req, res) => res.json({ db: mongoose.connection.readyState === 1 }));

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
server.listen(PORT, () => console.log(`Port ${PORT}`));

module.exports = app;
