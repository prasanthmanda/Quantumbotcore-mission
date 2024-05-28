/* eslint-disable no-unused-vars */
const admin = require("firebase-admin");
const logger = require("../utils/logger");
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Sends a chat message.
 * @param {string} chatId - ID of the chat session.
 * @param {string} senderId - ID of the user sending the message.
 * @param {string} messageContent - Content of the message.
 * @return {Promise<string>} The promise resolving with the message ID.
 */
async function sendMessage(chatId, senderId, messageContent) {
  const chatRef = db.collection("chats").doc(chatId);
  const message = {
    senderId: senderId,
    content: messageContent,
    timestamp: admin.firestore.Timestamp.now(),
  };

  // Add message to the 'messages' sub-collection
  const messageRef = await chatRef.collection("messages").add(message);
  // eslint-disable-next-line max-len
  logger.info("Message added to chat", {messageId: messageRef.id, chatId, senderId});
  return messageRef.id;
}
module.exports = {sendMessage};

