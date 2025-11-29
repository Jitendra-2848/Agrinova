  const shop = require("../models/shop");
  const Track = require("../models/track");

//    Get full tracking details using tracking_id
 const tracking = async (req, res) => {
  try {
    const {id} = req.body;
    console.log(req.body)
    const product_detail = await shop.findOne({tracking_id:id}).select("-user");
    const detail = await Track.findOne({ tracking_id: id }).select("-user");
    console.log(detail + product_detail)
    if(!product_detail || !detail){
      return res.status(500).json({ message: "Id not found" });
    }
    return res.status(200).json({ detail:detail,product:detail });
  } catch (error) {
    console.error("tracking error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//    Get all tracking info for a user
 const getAllTracks = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(req.body);
    console.log(id);
    const detail = await Track.find({ user: id });
    console.log(detail)
    return res.status(200).json({ tracks: detail });
  } catch (error) {
    console.error("getAllTracks error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//    Delete a tracking record using its ID
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

const vieworder = async(req,res)=>{
  try {
    const data = await shop.find({farmer:req.user});
    return res.status(200).json({data:data});
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  tracking,
  getAllTracks,
  deleteTrack,
  vieworder,
}
