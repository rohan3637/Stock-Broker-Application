const express = require("express");
const searchStocks = require("../opensearch/searchStocks.js");
const pushToOpenSearch = require("../opensearch/pushToOpenSearch.js");

const router = express.Router();

router.get("/", searchStocks);
router.post("/", pushToOpenSearch);

module.exports = router;
