const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/roleMiddleware");
const { getProducts, createProduct, updateProduct } = require("../controllers/productController");

router.get("/", getProducts);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);

module.exports = router;
