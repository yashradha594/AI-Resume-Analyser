const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  updateRole,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// console.log("REGISTER FUNCTION:", register);

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/role", protect, updateRole);

module.exports = router;
