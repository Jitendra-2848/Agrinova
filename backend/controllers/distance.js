// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const pincodeDataPath = path.join(__dirname, "../data/pincodes.json");
// const pincodeData = JSON.parse(fs.readFileSync(pincodeDataPath, "utf-8"));

// function haversine(lat1, lon1, lat2, lon2) {
//   const R = 6371; 
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(lat1 * Math.PI / 180) *
//       Math.cos(lat2 * Math.PI / 180) *
//       Math.sin(dLon / 2) ** 2;

//   return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// export const getDistance = async (req, res) => {
//     try {
//       console.log(req.body);
//       const { pin1, pin2 } = req.body;
      

//     if (!pin1 || !pin2) {
//       return res.status(400).json({ msg: "Both pincodes are required" });
//     }

//     const loc1 = pincodeData.find(p => p.Pincode == pin1);
//     const loc2 = pincodeData.find(p => p.Pincode == pin2);

//     if (!loc1 || !loc2) {
//       return res.status(404).json({ msg: "One or both pincodes not found" });
//     }
//     console.log("Loc1:", loc1.Latitude, loc1.Longitude);
// console.log("Loc2:", loc2.Latitude, loc2.Longitude);

//     const distance = haversine(
//       parseFloat(loc1.Latitude),
//       parseFloat(loc1.Longitude),
//       parseFloat(loc2.Latitude),
//       parseFloat(loc2.Longitude)
//     );

//     res.json({
//       msg: "Distance calculated successfully",
//       distance: distance.toFixed(2) + " km",
//       from: {
//         pincode: loc1.Pincode,
//         office: loc1.OfficeName,
//         district: loc1.District,
//         state: loc1.StateName,
//       },
//       to: {
//         pincode: loc2.Pincode,
//         office: loc2.OfficeName,
//         district: loc2.District,
//         state: loc2.StateName,
//       },
//     });
//   }
//   catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };



// distance.js

// Correct import
const Pincode = require("pincode-distance").default;

// create instance
const pd = new Pincode();

/**
 * Returns distance in KM between two Indian pincodes
 * @param {string|number} p1 
 * @param {string|number} p2 
 * @returns number | null
 */
function distance(p1, p2) {
  try {
    if (!p1 || !p2) {
      throw new Error("Both pincodes are required");
    }

    // Ensure they are strings
    p1 = String(p1);
    p2 = String(p2);

    const dist = pd.getDistance(p1, p2);

    if (dist === null || dist === undefined) {
      console.log("Invalid pincode(s)");
      return null;
    }

    return dist;

  } catch (err) {
    console.error("Error calculating distance:", err.message);
    return null;
  }
}

// export function
module.exports = distance;

