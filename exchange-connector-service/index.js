const express = require("express");
const cors = require("cors");
const axios = require("axios");

const PORT = 5002;

const app = express();
app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);
app.use(express.json());

app.post("/register-webhook", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5003/register-webhook",
      {
        url: "http://localhost:5002/trigger-webhook-url",
      }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error registering webhook", err.message);
    res.status(500).json({ message: "Error registering webhook" });
  }
});

// Route to trigger the webhook on Server 1
app.post("/trigger-webhook-url", async (req, res) => {
  try {
    console.log("Webhook URL is triggered");
    res.status(200).json({ message: "Webhook URL is triggered" });
  } catch (err) {
    // Handle errors
    console.error("Error triggering webhook ", err.message);
    res.status(500).json({ message: "Error triggering webhook" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
