const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToMongoDB = require("./config/connectToMongoDB.js");

const userRouter = require("./routes/user.route.js");

dotenv.config();
const PORT = process.env.PORT || 8001;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send("Stock Broker User Service !!");
});

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is listening at http://localhost:${PORT}`);
});
