const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");

const router = express.Router();

// Access or Create Chat One on One
router.post("/", protect, accessChat);

// Fetch All Chat by User
router.get("/", protect, fetchChats);

// Create New Group Chat
router.post("/group", protect, createGroupChat);

// Rename Group Chat
router.put("/rename", protect, renameGroup);

// Add Member to Group Chat
router.put("/groupadd", protect, addToGroup);

// Remove Member from Group Chat
router.put("/groupremove", protect, removeFromGroup);

module.exports = router;
