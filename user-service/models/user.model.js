const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  watchlists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "watchlist",
    },
  ],
});

const User = mongoose.model("users", usersSchema);

module.exports = User;
