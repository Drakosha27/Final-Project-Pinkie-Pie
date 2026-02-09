const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createOrder, getOrders, updateOrderStatus, getAllOrders } = require("../controllers/orderController");
const { admin } = require("../middleware/roleMiddleware");

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/all", protect, admin, getAllOrders);
router.patch("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
