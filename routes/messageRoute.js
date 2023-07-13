const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { route } = require("./chatRoutes");
const {
  sendMessage,
  allMessage,
} = require("../controllers/messageControllers");

const router = express.Router();

// Send Message
router.post("/", protect, sendMessage);

// Get All Message By Id
router.get("/:chatId", protect, allMessage);

module.exports = router;
