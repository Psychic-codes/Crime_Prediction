const express = require("express");
const bcrypt = require("bcryptjs");
const { body } = require('express-validator')
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();
const {register,login,getProfile} = require('../controllers/authController')

// Register User
router.post("/register",register);

// Login User
router.post("/login",login);
router.get('/getMe',verifyToken,getProfile)

module.exports = router;
