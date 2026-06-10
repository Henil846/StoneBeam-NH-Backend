const express = require("express");
const otpController = require("../controllers/otp.controller");
const router = express.Router();

router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);

module.exports = router;
