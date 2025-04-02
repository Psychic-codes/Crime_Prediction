const jwt = require('jsonwebtoken')
require('dotenv').config();
const UserModel = require('../models/user.model')

verifyToken = async (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if(!token) return res.status(400).json({message: "Unauthorized"})

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        req.user = user;
        next();
    }catch(error){
        res.status(403).json({ error: "Invalid token" });
    }
}

module.exports = verifyToken