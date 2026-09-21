const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns");
const cors = require("cors");

require("dotenv").config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://hire-up-placement-portal.vercel.app/"
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running..");
});

// MongoDB Connection

console.log("Mongo URL exists:", !!process.env.MONGO_URL);
console.log(
  "Mongo host:",
  new URL(process.env.MONGO_URL).hostname
);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(" MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed:", err.message);
  });