const getMarketDataFeed = require("../marketDataAPI/getMarketData.js");

const loadMarketData = async (req, res) => {
  try {
    getMarketDataFeed();
    return res.status(200).json({
      success: true,
      message: "Data received",
    });
  } catch (error) {
    console.log("Error in loading market data : ", error.message());
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!" + error.message,
    });
  }
};

module.exports = loadMarketData;
