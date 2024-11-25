const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  email: String,
  message: {
    _id: String,
    text: String,
    createdAt: Date,
    user: {
      _id: String,
      name: String,
      avatar: String,
    },
  },
});

const chatModel = mongoose.model("chats", chatSchema);
module.exports = chatModel;
