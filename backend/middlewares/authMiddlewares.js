const JWT = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

//protected routes 
const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, "Shaebu234");
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            success: false,
            message: "Please login to access!!"
        });
    }
};

//admin routes

const isAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User not found"
            });
        }
        if (user.role !== "admin") {
            return res.status(403).send({
                success: false,
                message: "You are not Authorized to Access !!"
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Admin Middleware",
            error
        });
    }
};

module.exports = { isAdmin, requireSignIn };