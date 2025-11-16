require("dotenv").config()
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongo = require("mongoose")
// const connectDB = require("./config/db.js");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authroutes.js");
const distanceRoutes = require("./routes/distanceroute.js");
const cartRoutes = require("./routes/cartroute.js");
const messageRoutes = require("./routes/messageroute.js");
const productRoutes = require("./routes/productroute.js");
const shopRoutes = require("./routes/shoproutes.js");
const trackRoutes = require("./routes/trackroutes.js");
const transportRoutes = require("./routes/transportroute.js");
dotenv.config();
const app = express();
mongo.connect(`${process.env.MONGO_URI}`)
  .then(() => console.log("MongoDB connected..."))
  .catch((e) => console.error("Mongo error:", e));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173",    // frontend
    "https://hoppscotch.io",   // hoppscotch cloud
    "http://localhost:3000"],
  credentials: true,
}));
//app.get("/", (req, res) => res.send("AgriNova Backend Running "));
app.get("/", (req, res) => {
  res.send("AgriNova Backend Running ");
});
app.use("/api/auth", authRoutes);
app.use("/api/pincode", distanceRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/product", productRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/track", trackRoutes);
app.use("/api/transport", transportRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
