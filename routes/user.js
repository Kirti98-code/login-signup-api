const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Protected Profile Data",
    user: req.user,
  });
});

module.exports = router;