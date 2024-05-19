const mongoose = require("mongoose");

const watchlistSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  stocks: [
    {
      type: String,
    },
  ],
});
const watchlist = mongoose.model("watchlist", watchlistSchema);

module.exports = watchlist;
