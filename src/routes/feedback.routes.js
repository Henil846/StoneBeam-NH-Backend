const express = require("express");
const feedbackController = require("../controllers/feedback.controller");
const router = express.Router();

router.post("/feedback",feedbackController.feedback);

module.exports = router;