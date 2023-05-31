const { MongoClient } = require("mongodb");
// Connection URI
//const uri = "mongodb://127.0.0.1:27017";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_CLUSTER}.l3zqqws.mongodb.net/?retryWrites=true&w=majority`;
// // Create a new MongoClient
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
const client = new MongoClient(uri);

//Async function to run db connection
const run = async(callbackFn) => {
  let error;
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to MongoDB server");
  } catch(e) {
    // throw any error
    error = e.message;
  }
  callbackFn(client, error);
}

module.exports = { run };

