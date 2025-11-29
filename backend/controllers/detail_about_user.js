const vendor = require("../models/user_detail/vendor")
const farmer = require("../models/user_detail/farmer")
const transporter = require("../models/user_detail/transporter")
const vendor_detail = async(req,res)=>{
    try {
        const data = await vendor.findOne({user:req.user});
        if(!data){
            return res.status(500).json({message:"Not a valid user"});
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server error"})
    }
}
const farmer_detail = async(req,res)=>{
    try {
        const data = await farmer.findOne({user:req.user});
        if(!data){
            return res.status(500).json({message:"Not a valid user"});
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server error"})
    }
}
const transporter_detail = async(req,res)=>{
    try {
        const data = await transporter.findOne({user:req.user});
        if(!data){
            return res.status(500).json({message:"Not a valid user"});
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server error"})
    }
}

module.exports = {
    farmer_detail,
    vendor_detail,
    transporter_detail
}