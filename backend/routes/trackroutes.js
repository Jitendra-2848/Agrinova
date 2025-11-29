const express = require("express");

const { tracking, getAllTracks, deleteTrack, vieworder } = require("../controllers/trackcontroller.js");
const verifyToken  = require("../middlewares/authmiddleware.js");

const router = express.Router();

router.post("/track", verifyToken, tracking);
router.post("/all", verifyToken, getAllTracks);
router.delete("/delete", verifyToken, deleteTrack);
router.get("/view", verifyToken, vieworder);
module.exports = router;
