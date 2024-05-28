const functions = require("firebase-functions");
const {sendMessage} = require("./api/chat");
const logger = require("./utils/logger");
/**
 * Sends a chat message.
 * @param {functions.Request} request - The HTTP request object.
 * @param {functions.Response} response - The HTTP response object.
 * @returns {Promise<void>}
 */
// eslint-disable-next-line max-len
exports.sendChatMessage = functions.https.onRequest(async (request, response) => {
  if (request.method !== "POST") {
    logger.error("Method Not Allowed", {method: request.method});
    return response.status(405).send("Method Not Allowed");
  }

  const {chatId, senderId, messageContent} = request.body;

  // Validate request body
  if (!chatId || typeof chatId !== "string") {
    logger.error("Invalid or missing chatId", {chatId});
    return response.status(400).send("Invalid or missing chatId");
  }

  if (!senderId || typeof senderId !== "string") {
    logger.error("Invalid or missing senderId", {senderId});
    return response.status(400).send("Invalid or missing senderId");
  }

  if (!messageContent || typeof messageContent !== "string") {
    logger.error("Invalid or missing messageContent", {messageContent});
    return response.status(400).send("Invalid or missing messageContent");
  }

  try {
    const messageId = await sendMessage(chatId, senderId, messageContent);
    logger.info("Message sent successfully", {messageId, chatId, senderId});
    response.send({
      success: true,
      messageId: messageId,
      message: "Message sent successfully!",
    });
  } catch (error) {
    logger.error("Error sending message", {error: error.toString()});
    response.status(500).send({
      success: false,
      error: error.toString(),
    });
  }
});
