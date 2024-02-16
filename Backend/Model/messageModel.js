const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    chatId: String,
    senderId: String,
    text: String
  },
  { timestamps: true }
);

exports.Message = mongoose.model("Message", messageSchema);
