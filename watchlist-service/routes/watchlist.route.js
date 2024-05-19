const express = require("express");
const {
  addWatchList,
  addStockToWatchList,
  getWatchLists,
  deleteWatchList,
  deleteStockFromWatchList,
} = require("../controllers/watchlist.controller.js");

const router = express.Router();

router.post("/add", addWatchList);
router.post("/addStock", addStockToWatchList);
router.get("/get", getWatchLists);
router.delete("/delete", deleteWatchList);
router.delete("/deleteStock", deleteStockFromWatchList);

module.exports = router;
