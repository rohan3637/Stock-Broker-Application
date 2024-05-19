const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const searchRoute = require("./routes/search.route.js");

dotenv.config();
const PORT = process.env.PORT || 5004;

const app = express();
app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);
app.use(express.json());

app.use("/search", searchRoute);

app.get("/", (req, res) => {
  res.send("HHLD Youtube transcoder service.");
});

app.listen(PORT, () => {
  console.log(`Server is listening at PORT: ${PORT}`);
});
