const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// router.route("/").post(registerUser);

// Fetch All User or By Search Keywords
router.get("/", protect, allUsers);

// Sign Up
router.post("/", registerUser);

// Sign In
router.post("/login", authUser);

module.exports = router;
