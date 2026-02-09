const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  totalPrice: Number,
  status: { type: String, enum: ["pending","completed"], default: "pending" }
});

module.exports = mongoose.model("Order", orderSchema);
