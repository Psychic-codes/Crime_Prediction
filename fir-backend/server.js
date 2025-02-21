require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }))

// Database Connection with Try-Catch
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Start the server only if DB connects
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error(" Server Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();

// Routes
app.get("/", (req, res) => {
  res.send("🚀 FIR Platform API is running...");
});


const authRouter = require("./routes/auth");
const firRouter = require("./routes/FIR");
app.use("/api/auth", authRouter);
app.use("/api/fir",firRouter);

