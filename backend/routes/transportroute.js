const express = require("express");

const { updateTrack, delivered, rejected, aiTest } = require("../controllers/transportcontroller.js");
const verifyToken  = require("../middlewares/authmiddleware.js");

const router = express.Router();

router.put("/update", verifyToken, updateTrack);
router.put("/delivered", verifyToken, delivered);
router.put("/rejected", verifyToken, rejected);
router.get("/aitest", aiTest);  // optional, usually for debugging

module.exports = router;
