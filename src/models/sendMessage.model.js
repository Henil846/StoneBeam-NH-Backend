const mongoose = require('mongoose');

const sendMessageSchema = new mongoose.Schema({
  name:{
    type : String,
    required : true,
  },
  email:{
    type: String,
    lowercase: true,
    required : true,
    trim : true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone:{
    type: String,
     match: /^[0-9]{10}$/,
  },
  subject:{
    type : String,
    required :true,
  },
  message:{
    type: String,
    required : true,
  }
})

const sendMessageModel = mongoose.model('sendMessage',sendMessageSchema);

module.exports = sendMessageModel;
