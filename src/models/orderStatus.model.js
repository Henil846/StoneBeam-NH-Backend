const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: String,

  materials: [
    {
      name: String,
      quantity: Number,
      unit: String,
    }
  ],

  total: Number,

  orderDate: Date,

  status: {
    type: String,
    enum: ["Pending", "Processing", "In Transit", "Delivered"],
    default: "Pending"
  },

  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);