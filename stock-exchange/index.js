const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");

const PORT = 5003;

const app = express();
app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);
app.use(express.json());
app.use(bodyParser.json());

const webhookURLs = [];

app.post("/register-webhook", (req, res) => {
  const webhookURL = req.body.url;
  webhookURLs.push(webhookURL);
  res.status(200).json({ message: "Webhook registered successfully" });
});

// Route to handle triggering the webhook
app.post("/trigger-event", async (req, res) => {
  if (webhookURLs.length === 0) {
    return res.status(400).json({ message: "No webhook URL registered" });
  }
  const webhookURL = webhookURLs[0];
  console.log(webhookURL);
  try {
    console.log("Triggering Webhook URL");
    const response = await axios.post(webhookURL);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error triggering webhook url", err.message);
    res.status(500).json({ message: "Error triggering webhook url" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
