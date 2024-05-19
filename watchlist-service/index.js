const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToMongoDB = require("./config/connectToMongoDB.js");

const watchListRouter = require("./routes/watchlist.route.js");

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/watchlist", watchListRouter);

app.get("/", (req, res) => {
  res.send("Stock Broker Watch Service !!");
});

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is listening at http://localhost:${PORT}`);
});
