const { Chat } =  require("../Model/chatModel");

exports.createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  const chat = await Chat.findOne({
    members: { $all: [firstId, secondId] },
  });
  if (chat) res.status(200).json({ chat });
  const newChat = new Chat({
    members: [firstId , secondId]
  });
  const response = await newChat.save();
  res.status(200).json(response);
};

exports.findUserChats = async(req , res) => {
    const userId = req.params.userId;
    const chats = await Chat.find({
        members: {$in: [userId]},
    })
    res.status(200).json(chats);
}

exports.findChat = async(req , res) => {
    const {firstId , secondId} = req.params;
    const chat = await Chat.findOne({
        members: { $all: [firstId , secondId]}
    })
    res.status(200).json(chat);
}
