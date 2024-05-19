const UpstoxClient = require("upstox-js-sdk");
const { WebSocket } = require("ws");
const protobuf = require("protobufjs");
const path = require('path');

//const __dirname = path.resolve(path.dirname(''));
//console.log(__dirname);

let protobufRoot = null;
let defaultClient = UpstoxClient.ApiClient.instance;
let apiVersion = "2.0";
let OAUTH2 = defaultClient.authentications["OAUTH2"];
OAUTH2.accessToken = process.env.ACCESS_TOKEN;

// Function to authorize the market data feed
const getMarketFeedUrl = async () => {
 return new Promise((resolve, reject) => {
   let apiInstance = new UpstoxClient.WebsocketApi(); // Create new Websocket API instance

   // Call the getMarketDataFeedAuthorize function from the API
   apiInstance.getMarketDataFeedAuthorize(
     apiVersion,
     (error, data, response) => {
       if (error) reject(error);
       else resolve(data.data.authorizedRedirectUri);
     }
   );
 });
};

// Function to establish WebSocket connection
const connectWebSocket = async (wsUrl) => {
 return new Promise((resolve, reject) => {
   const ws = new WebSocket(wsUrl, {
     headers: {
       "Api-Version": apiVersion,
       Authorization: "Bearer " + OAUTH2.accessToken,
     },
     followRedirects: true,
   });

   // WebSocket event handlers
   ws.on("open", () => {
     console.log("connected");
     resolve(ws); // Resolve the promise once connected

     // Set a timeout to send a subscription message after 1 second
     setTimeout(() => {
       const data = {
         guid: "someguid",
         method: "sub",
         data: {
           mode: "full",
           instrumentKeys: ["NSE_INDEX|Nifty Bank", "NSE_INDEX|Nifty 50", "NSE_EQ|INE040A01034"],
         },
       };
       ws.send(Buffer.from(JSON.stringify(data)));
     }, 1000);
   });

   ws.on("close", () => {
     console.log("disconnected");
   });

   ws.on("message", (data) => {
     console.log(JSON.stringify(decodeProfobuf(data))); // Decode the protobuf message on receiving it
   });

   ws.on("error", (error) => {
     console.log("error:", error);
     reject(error); // Reject the promise on error
   });
 });
};

// Function to initialize the protobuf part
const initProtobuf = async () => {
 console.log(__dirname)
 protobufRoot = await protobuf.load("F:/stock-broker/Stock-Broker-Application/market-data-service/marketDataAPI/marketDataFeed.proto");
 console.log("Protobuf part initialization complete");
};

// Function to decode protobuf message
const decodeProfobuf = (buffer) => {
 if (!protobufRoot) {
   console.warn("Protobuf part not initialized yet!");
   return null;
 }

 const FeedResponse = protobufRoot.lookupType(
   "com.upstox.marketdatafeeder.rpc.proto.FeedResponse"
 );
 return FeedResponse.decode(buffer);
};

const getMarketDataFeed = async () => {
 try {
   await initProtobuf(); // Initialize protobuf
   const wsUrl = await getMarketFeedUrl(); // Get the market feed URL
   const ws = await connectWebSocket(wsUrl); // Connect to the WebSocket
 } catch (error) {
   console.error("An error occurred:", error);
 }
}

module.exports = getMarketDataFeed;