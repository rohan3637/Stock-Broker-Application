const express = require("express");
const {
    getOrderHistory,
    placeOrder,
    cancelOrder
} = require("../controllers/orders.controller.js");

const router = express.Router();

router.get("/", getOrderHistory);
router.post("/add", placeOrder);
router.delete("/cancel", cancelOrder);

module.exports = router;