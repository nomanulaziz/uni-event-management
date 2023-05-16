const mongoose = require("mongoose");
const {Schema} = mongoose;

const usersSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
},
    {timestamps: true}
);

// User -> import name, user -> model name in database
module.exports = mongoose.model('User',usersSchema,'user');