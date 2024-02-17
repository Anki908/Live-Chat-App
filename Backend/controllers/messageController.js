const { Message } =  require("../Model/messageModel");

exports.createMessage = async(req , res) => {
    const {chatId , senderId , text} = req.body;
    const msg = new Message({
        chatId,
        senderId,
        text
    })
    const response = await msg.save();
    res.status(200).json(response);
}

exports.getMessages = async(req , res) => {
    console.log("message backend triggered");
    const { chatId } = req.params;
    const msg = await Message.find({ chatId });
    res.status(200).json(msg); 
}