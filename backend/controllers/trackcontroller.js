const Track = require( "../models/track.js");

// ✅ Get full tracking details using tracking_id
 const tracking = async (req, res) => {
  try {
    const { id } = req.body;

    const detail = await Track.find({ tracking_id: id }).select("-user");

    return res.status(200).json({ detail });
  } catch (error) {
    console.error("tracking error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all tracking info for a user
 const getAllTracks = async (req, res) => {
  try {
    const { id } = req.body;

    const detail = await Track.find({ user: id })
      .select("tracking_id reached status");

    return res.status(200).json({ tracks: detail });
  } catch (error) {
    console.error("getAllTracks error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete a tracking record using its ID
 const deleteTrack = async (req, res) => {
  try {
    const { id } = req.body;

    await Track.findByIdAndDelete(id);

    return res.status(200).json({ message: "Deleted successfully!" });
  } catch (error) {
    console.error("deleteTrack error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  tracking,
  getAllTracks,
  deleteTrack,
}
