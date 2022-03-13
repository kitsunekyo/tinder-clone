const { MongoClient } = require("mongodb");
const uri = process.env.CONNECTION_STRING;

let client;

async function getDb() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  const db = client.db("tinderclone");
  return db;
}

function close() {
  if (client) {
    client.close();
    client = null;
  }
}

module.exports = {
  getDb,
  close,
};
