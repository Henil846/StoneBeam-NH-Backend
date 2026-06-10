const express = require("express");
const orderStatusController = require("../controllers/orderStatus.controller");
const router = express.Router();

router.get("/orderStatus", orderStatusController.getOrders);

module.exports = router;