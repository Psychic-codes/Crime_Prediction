const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const verifyToken = require("../middleware/authMiddleware");

const authRouter = express.Router();

// Register User
authRouter.post("/register", async (req, res) => {
  const { email, password, role, location } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const User = await UserModel.create({
      email,
      password: hashedPassword,
      role,
      location,
    })

    res.status(201).json({ message: "User registered successfully",role: role});
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login User
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" ,isMatch});

    const token = jwt.sign({ id: user._id, role: user.role, location: user.location }, process.env.JWT_SECRET);

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

module.exports = authRouter;
