const express = require("express");
const router = express.Router();
const { proxyChat } = require("../controllers/chatController");

// POST /api/chat - Proxy chat messages to AI service
router.post("/", proxyChat);

module.exports = router;
