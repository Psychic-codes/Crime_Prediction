const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.register = async (req, res, next) => {
    try {
        const { fullname, email, password, role, location } = req.body;

        // Check if required fields are provided
        if (!fullname || !fullname.firstname || !fullname.lastname || !email || !password || !role || !location) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required user details",
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Create user
        const newUser = await UserModel.create({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname,
            },
            email,
            password,
            role,
            location,
        });

        sendTokenResponse(newUser, 201, res);
    } catch (err) {
        console.error("Error in registration:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


exports.login = async (req,res,next)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message:'Invalid Credentials'
            })
        }

        const User = await UserModel.findOne({email : email}).select('+password')

        const isMatch = await User.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: 'Invalid Password'
            })
        }

        sendTokenResponse(User, 200, res);
    }catch(err){
        console.error("Error in registration:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

exports.getProfile= async (req,res,next) => {
    try{
        const user = await UserModel.findById(req.user.id);
    
        res.status(200).json({
            success: true,
            data: user
        });
    }catch(err){
        console.error("Error in registration:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}




function sendTokenResponse(user,statusCode,res){
    const token = jwt.sign({id:user._id,role: user.role},process.env.JWT_SECRET,{expiresIn: '24h'});
    return res.status(statusCode).json({ success: true, token,role:user.role });
}