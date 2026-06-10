const feedbackModel = require("../models/feedback.model");

async function feedback(req, res) {
  try {
    const { message } = req.body;

    const newFeedback = await feedbackModel.create({
      message,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      data: newFeedback,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = { feedback };