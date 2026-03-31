const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// GET - User orders page
router.get("/", orderController.getOrderPage);

// POST - Place new order
router.post("/place", orderController.placeOrder);

module.exports = router;