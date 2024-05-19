const { Client } = require("@opensearch-project/opensearch");

const searchStocks = async (req, res) => {
  try {
    const searchTerm = req.query.searchQuery || "";
    var client = new Client({ node: process.env.HOST_AIVEN });
    const { body } = await client.search({
      index: "all_stocks", // Index name in OpenSearch
      body: {
        query: {
          match: {
            name: {
              query: searchTerm,
              fuzziness: "AUTO",
            },
          },
        },
      },
    });
    const hits = body.hits.hits;
    res.status(200).json(hits);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error searching videos. " + err.message,
    });
  }
};

module.exports = searchStocks;
