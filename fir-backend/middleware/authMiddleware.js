const jwt = require('jsonwebtoken')
require('dotenv').config()

function verifyToken(req,res,next){
    const token = req.headers.authorization?.split(" ")[1];

    if(!token) return res.status(400).json({message: "Not signed up"})

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded;
        next()
    }catch(error){
        res.status(403).json({ error: "Invalid token" });
    }
}

module.exports = verifyToken