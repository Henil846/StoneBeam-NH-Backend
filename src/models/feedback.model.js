const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  message:{
    type : String,
  }
})

const feedbackmodel = mongoose.model("feedback",feedbackSchema);

module.exports = feedbackmodel;