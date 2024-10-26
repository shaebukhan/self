const userModel = require("../models/UserModel");
const { hashPassword, comparePassword } = require("../utils/authHelper");
const JWT = require("jsonwebtoken");
const RegisterController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.send({
                message: "All Fields are  Required !! "
            });
        }
        //check existing user 
        const ExistingUser = await userModel.findOne({ email });
        if (ExistingUser) {
            return res.status(201).send({
                success: false,
                message: "User Already Exists !! Please Login"
            });
        }
        const hashedPassword = await hashPassword(password);
        const user = await userModel({ name, email, password: hashedPassword }).save();
        res.status(201).send({
            success: true,
            message: "Registered SuccessFully !!",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        });
    }
};

const LoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid Crediantials !!"
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid Email or Password !!"
            });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid  Password !!"
            });

        }
        const token = await JWT.sign({ _id: user._id }, "Shaebu234", { expiresIn: "1day" });
        res.status(200).send({
            success: true,
            message: "Logged in SuccessFully !!!",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                userId: user._id
            },
            token
        });
    } catch (error) {

    }
};

module.exports = { RegisterController, LoginController };