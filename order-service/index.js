const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
//const connectToMongoDB = require("./config/connectToMongoDB.js");

const orderRouter = require("./routes/orders.route.js");

dotenv.config();
const PORT = process.env.PORT || 8002;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("Stock Broker Order Service !!");
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
