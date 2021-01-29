const fs = require("../config/firebase_connect");

const createChatroom = async (roomData) => {
  try {
    const chatroom = await fs.collection("Message").add(roomData);

    return chatroom;
  } catch (error) {
    throw new Error(`Failed creating chat room. ${error.message}`);
  }
};

module.exports = { createChatroom };
