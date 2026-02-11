// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /api/auth/register - HU-01
router.post("/register", authController.register);

// POST /api/auth/login - HU-01
router.post("/login", authController.login);

// GET /api/auth/profile/:userId
router.get("/profile/:userId", authController.getProfile);

module.exports = router;
