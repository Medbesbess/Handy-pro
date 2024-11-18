// routes/conversationRoutes.js
const express = require("express");
const router = express.Router();
const {
  getMessages,
  getConversation,
  getAllConversations,
  searchConversations,
  getUnreadCount,
  markMessagesAsRead,
  createConversation
} = require("../controllers/conversations");

// IMPORTANT: La route de recherche doit être placée AVANT les routes avec des paramètres dynamiques
router.get('/search', searchConversations);
router.post('/create', createConversation);
router.get('/:id', getConversation);
router.get('/:id/messages', getMessages);
router.get('/:userId/Allconversations', getAllConversations);
router.get('/unread/:userId', getUnreadCount);
router.put('/:conversationId/read', markMessagesAsRead);

module.exports = router;