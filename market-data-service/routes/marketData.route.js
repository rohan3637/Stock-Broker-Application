const express = require("express");
const loadMarketData = require("../controllers/marketData.controller.js");

const router = express.Router();

router.post("/load", loadMarketData)

module.exports = router;