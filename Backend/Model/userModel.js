const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
},
{ timestamps: true}
)

exports.User = mongoose.model('User' , userSchema);