const express = require("express");
const { getMessages, sendMessage } = require("../controllers/messagecontroller.js");
const verifyToken  = require("../middlewares/authmiddleware.js");

const router = express.Router();

router.post("/get", verifyToken, getMessages);
router.post("/send", verifyToken, sendMessage);

module.exports = router;
