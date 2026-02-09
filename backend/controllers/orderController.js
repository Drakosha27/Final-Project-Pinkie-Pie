const Order = require("../models/Order");

const createOrder = async (req, res) => {
  const order = await Order.create({ user: req.user._id, ...req.body });
  res.status(201).json(order);
};

const getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("products");
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!["pending", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate("products");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("products").populate("user");
  res.json(orders);
};

module.exports = { createOrder, getOrders, updateOrderStatus, getAllOrders };
