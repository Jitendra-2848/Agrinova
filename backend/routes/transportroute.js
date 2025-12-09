const express = require("express");

const { updateTrack, delivered, rejected, accepting, find,Activejobs, history } = require("../controllers/transportcontroller.js");
const verifyToken  = require("../middlewares/authmiddleware.js");

const router = express.Router();

router.put("/update", verifyToken, updateTrack);
router.put("/delivered", verifyToken, delivered);
router.put("/rejected", verifyToken, rejected);
router.put("/accept_transport", verifyToken, accepting);
router.get("/findjob", verifyToken, find);
router.get("/active",verifyToken,Activejobs)
router.get("/history",verifyToken,history)
module.exports = router;
