const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load env first
dotenv.config();

const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoute);

// Root health check
app.get("/", (req, res) => {
    res.status(200).json({ status: 'OK', system: 'Royal Orient API', version: '1.0.0' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;