const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.id;    // ✅ id + role available everywhere
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
module.exports = verifyToken;
