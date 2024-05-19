const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");

const {
  mockStockPrices,
  mockHistoricalData,
  mockCompanyInfo,
  mockUserPortfolios,
} = require("./mockData.js");

// Define schema using GraphQL SDL
const schema = buildSchema(`
 type StockPrice {
   symbol: String!
   price: Float!
   timestamp: String!
 }

 type HistoricalData {
   date: String!
   open: Float!
   high: Float!
   low: Float!
   close: Float!
   volume: Int!
 }

 type CompanyInfo {
   name: String!
   sector: String!
   CEO: String!
   headquarters: String!
   description: String!
 }

 type Holding {
   symbol: String!
   quantity: Int!
   averagePrice: Float!
 }

 type UserPortfolio {
   holdings: [Holding!]!
   cashBalance: Float!
   totalValue: Float!
 }

 type Query {
   stockPrice(symbol: String!): StockPrice
   historicalData(symbol: String!, startDate: String!, endDate: String!): [HistoricalData!]!
   companyInfo(symbol: String!): CompanyInfo
   userPortfolio(userId: String!): UserPortfolio
 }
`);

// Resolver functions
const root = {
  stockPrice: ({ symbol }) => mockStockPrices[symbol],
  historicalData: ({ symbol, startDate, endDate }) =>
    mockHistoricalData[symbol].filter(
      (entry) => entry.date >= startDate && entry.date <= endDate
    ),
  companyInfo: ({ symbol }) => mockCompanyInfo[symbol],
  userPortfolio: ({ userId }) => mockUserPortfolios[userId],
};

// Create an express server
const app = express();
app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);

// Define the GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL for easy testing
  })
);

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/graphql`);
});
