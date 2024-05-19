//const User = require("../models/user.model.js");
const axios = require("axios");

const getOrderHistory = async (req, res) => {
  axios
    .get("https://api.upstox.com/v2/order/retrieve-all", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    })
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(error.response?.status || 500).json({
        success: false,
        message: error.message,
      });
    });
};

const placeOrder = async (req, res) => {
  const data = {
    quantity: 1,
    product: "D",
    validity: "DAY",
    price: 0,
    tag: "string",
    instrument_token: "NSE_EQ|INE669E01016",
    order_type: "MARKET",
    transaction_type: "BUY",
    disclosed_quantity: 0,
    trigger_price: 0,
    is_amo: true,
  };
  axios
    .post("https://api.upstox.com/v2/order/place", data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    })
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(error.response?.status || 500).json({
        success: false,
        message: error.message,
      });
    });
};

const cancelOrder = async (req, res) => {
  const orderId = req.query.orderId || null;
  if (!orderId) {
    res.status(400).json({
      success: false,
      message: "Missing required param orderId",
    });
  }
  axios
    .delete(`https://api.upstox.com/v2/order/cancel?order_id=${orderId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    })
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(error.response?.status || 500).json({
        success: false,
        message: error.message,
      });
    });
};

module.exports = { getOrderHistory, placeOrder, cancelOrder };
