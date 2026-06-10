const orderModel = require("../models/orderStatus.model");

async function getOrders(req, res) {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message
    });
  }
}

module.exports = { getOrders };