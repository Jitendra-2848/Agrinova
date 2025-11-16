const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name:process.env.Cloudinary_CLOUD_NAME,
    api_key:process.env.Cloudinary_CLOUD_API_KEY,
    api_secret:process.env.Cloudinary_CLOUD_SECRET_KEY,
})

module.exports = cloudinary;




