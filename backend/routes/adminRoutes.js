const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const auth = require("../middleware/authMiddleware");

router.get("/stats", auth, async (req, res) => {
  try {

    //  Only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.json({
      totalJobs,
      totalApplications,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;