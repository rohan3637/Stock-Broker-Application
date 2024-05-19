const { Client } = require("@opensearch-project/opensearch");
const fs = require("fs");
const { parse } = require("csv-parse");

const pushToOpenSearch = async (req, res) => {
  try {
    const csvFilePath =
      "D:/Rohan/projects/hhld-stock-broker/search-service/NSE.csv";
    fs.createReadStream(csvFilePath)
      .pipe(parse({ delimiter: ",", quote: '"', columns: true }))
      .on("data", async (row) => {
        try {
          var client = new Client({ node: process.env.HOST_AIVEN });
          var index_name = "all_stocks";
          var stock_data = {
            instrumentKey: row["instrument_key"],
            name: row["name"],
            type: row["instrument_type"],
            exchange: row["exchange"],
          };
          await client.index({
            index: index_name,
            body: stock_data,
            refresh: true,
          });
          console.log("added stock data to open search...");
        } catch (err) {
          console.error(
            `Error inserting row: ${JSON.stringify(row)}, Error: ${err}`
          );
        }
      })
      .on("end", async () => {
        console.log("CSV file successfully processed.");
        res.status(200).json({
          success: true,
          message: "Pushed stock data to open search",
        });
      })
      .on("error", (error) => {
        console.error("Error parsing CSV:", error);
        res.status(500).json({
          success: false,
          message: "Something went wrong " + error.message,
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong " + err.message,
    });
  }
};

module.exports = pushToOpenSearch;
