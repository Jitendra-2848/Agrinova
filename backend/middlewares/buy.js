const user = require("../models/user");

const verifybuyer = async (req, res, next) => {
    try {
        const buyer = await user.findById(req.user);
        if (buyer.role == "vendor") {
            next();
        }
        else {
            return res.status(401).json({ error: "Only buyer can buy." });
        }
    } catch (err) {
        return res.status(401).json({ error: "Only buyer can buy." });
    }
};
module.exports = verifybuyer;
