require("dotenv").config();
const app = require("../src/app");
const connectDB = require("../src/db/db");

// Connect to MongoDB once (cached across invocations in Vercel)
let isConnected = false;

async function ensureConnection() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

// Wrap the Express app for Vercel serverless
module.exports = async (req, res) => {
  await ensureConnection();
  return app(req, res);
};
