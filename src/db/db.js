const mongoose = require("mongoose");
const dns = require("dns");

// Force Google DNS — local DNS server can't resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to Database");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    throw err; // Re-throw so server.js knows the connection failed
  }

  // Monitor connection after initial connect
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected successfully");
  });
}

module.exports = connectDB;