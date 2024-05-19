const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
//const connectToMongoDB = require("./config/connectToMongoDB.js");

//const userRouter = require("./routes/user.route.js");

dotenv.config();
const PORT = process.env.PORT || 8002;

const app = express();
app.use(cors());
app.use(express.json());

//app.use("/order", userRouter);

app.get("/", (req, res) => {
  res.send("Stock Broker Order Service !!");
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
