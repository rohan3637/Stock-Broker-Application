const express = require("express");
const dotenv = require("dotenv");
const UpstoxClient = require("upstox-js-sdk");
const response = require("./response.js");
const cors = require("cors");

dotenv.config();
const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());

const loginToUpstox = () => {
  let apiInstance = new UpstoxClient.LoginApi();
  let apiVersion = "2.0";
  let opts = {
    code: process.env.AUTH_CODE,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    grantType: "authorization_code",
  };
  apiInstance.token(apiVersion, opts, (error, data, response) => {
    if (error) {
      console.log("Error occurred: ", error.message);
    } else {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
    }
  });
};

app.get("/", async (req, res) => {
  res.json({ message: "HHLD Stock Broker Order Executioner Service" });
});

app.get("/getAccessToken", (req, res) => {
  loginToUpstox();
  res.json({ message: "Succeeded" });
});

app.get("/getOHLCData", (req, res) => {
  console.log("Getting OHLC data");
  const symbol = req.query.symbol;
  getMarketQuoteOHLC(symbol, (err, data) => {
    if (err) {
      res.status(500).json("failed");
    } else {
      res.status(200).json(data);
    }
  });
});

app.get("/getHistoricalData", (req, res) => {
  console.log("Getting Historical data");
  const symbol = req.query.symbol;
  getHistoricalData(symbol, (err, data) => {
    if (err) {
      res.status(200).json(response);
    } else {
      res.status(200).json(data);
    }
  });
});

const getHistoricalData = (symbol, callback) => {
  let defaultClient = UpstoxClient.ApiClient.instance;
  var OAUTH2 = defaultClient.authentications["OAUTH2"];
  OAUTH2.accessToken = process.env.ACCESS_TOKEN;
  let apiInstance = new UpstoxClient.HistoryApi();
  let apiVersion = "2.0";
  let interval = "1minute";
  let toDate = "2024-04-02";
  let fromDate = "2024-04-01";
  apiInstance.getHistoricalCandleData1(
    symbol,
    interval,
    toDate,
    fromDate,
    apiVersion,
    (error, data, response) => {
      if (error) {
        console.error(error.message);
        callback(error, null);
      } else {
        callback(null, data);
      }
    }
  );
};

const getMarketQuoteOHLC = (symbol, callback) => {
  let defaultClient = UpstoxClient.ApiClient.instance;
  var OAUTH2 = defaultClient.authentications["OAUTH2"];
  OAUTH2.accessToken = process.env.ACCESS_TOKEN;
  let apiInstance = new UpstoxClient.MarketQuoteApi();
  let apiVersion = "2.0";
  //let symbol = "NSE_EQ|INE669E01016";
  let interval = "1d";
  apiInstance.getMarketQuoteOHLC(
    symbol,
    interval,
    apiVersion,
    (error, data, response) => {
      if (error) {
        console.error(error.message);
        callback(error, null);
      } else {
        console.log(
          "API called successfully. Returned data: " + JSON.stringify(data)
        );
        callback(null, data);
      }
    }
  );
};

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
