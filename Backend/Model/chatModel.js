const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    members: Array
},
{ timestamps: true}
)

exports.Chat = mongoose.model('Chat' , userSchema);