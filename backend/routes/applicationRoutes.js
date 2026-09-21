const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const auth = require("../middleware/authMiddleware");


//  APPLY
router.post("/", auth, async (req, res) => {
  try {
    const application = new Application({
      student: req.user.id,
      job: req.body.job,
    });

    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title company")
      .populate("student", "name email");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE STATUS (ADMIN ONLY 🔥)
router.put("/:id", auth, async (req, res) => {
  try {

    // 🔒 CHECK ROLE
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;