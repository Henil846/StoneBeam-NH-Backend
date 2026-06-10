const sendMessageModel = require("../models/sendMessage.model");

async function sendMessage(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newMessage = await sendMessageModel.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = { sendMessage };