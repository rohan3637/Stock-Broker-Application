const WatchList = require("../models/watchlists.model.js");

const getWatchLists = async (req, res) => {
  try {
    const watchLists = await WatchList.find();
    return res.status(200).json(watchLists);
  } catch (err) {
    console.error("Error fetching watch lists:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Serval Error. " + err.message,
    });
  }
};

const addWatchList = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter title.",
      });
    }
    const existingWatchlist = await WatchList.findOne({ title: title });
    if (existingWatchlist) {
      return res.status(400).json({
        success: false,
        message: "Watchlist already exists with this name",
      });
    }
    const newWatchlist = new WatchList({
      title,
      stocks: [],
    });
    await newWatchlist.save();
    return res.status(201).json(newWatchlist);
  } catch (err) {
    console.error("Error fetching watch lists:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Serval Error. " + err.message,
    });
  }
};

const deleteWatchList = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter title.",
      });
    }
    const result = await WatchList.findOneAndDelete({ title: title });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Watchlist not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully deleted watchlist",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Serval Error. " + err.message,
    });
  }
};

const addStockToWatchList = async (req, res) => {
  try {
    const { watchlist, stock } = req.body;
    if (!watchlist || !stock) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters.",
      });
    }
    const existingWatchlist = await WatchList.findOne({ title: watchlist });
    if (!existingWatchlist) {
      return res.status(404).json({
        success: false,
        message: "Watchlish not found with title " + watchlist,
      });
    }
    if (existingWatchlist.stocks.includes(stock)) {
      return res.status(404).json({
        success: false,
        message: "Stock " + stock + "is already added to this watchlist.",
      });
    }
    existingWatchlist.stocks.push(stock);
    const updatedWatchList = await existingWatchlist.save();
    return res.status(200).json(updatedWatchList);
  } catch (err) {
    console.error("Error fetching watch lists:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Serval Error. " + err.message,
    });
  }
};

const deleteStockFromWatchList = async (req, res) => {
  try {
    const { title, stock } = req.query;
    if (!title || !stock) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters.",
      });
    }
    const existingWatchlist = await WatchList.findOne({ title: title });
    if (!existingWatchlist) {
      return res.status(404).json({
        success: false,
        message: "Watchlish not found with title " + title,
      });
    }
    if (!existingWatchlist.stocks.includes(stock)) {
      return res.status(404).json({
        success: false,
        message: "Stock " + stock + "not found to this watchlist.",
      });
    }
    existingWatchlist.stocks.remove(stock);
    await existingWatchlist.save();
    return res.status(200).json({
      success: true,
      message: "Successfully removed stock from watchlist",
    });
  } catch (err) {
    console.error("Error fetching watch lists:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Serval Error. " + err.message,
    });
  }
};

module.exports = {
  getWatchLists,
  addWatchList,
  addStockToWatchList,
  deleteWatchList,
  deleteStockFromWatchList,
};
