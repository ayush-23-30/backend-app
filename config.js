import mongoose from "mongoose";

let isConnected = false; // Global connection flag

const ConnectionWithDb = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_DB, {
     
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      connectTimeoutMS: 10000,        // Timeout for initial connection
    });
    isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database", error.message);
    process.exit(1);
  }
};

export default ConnectionWithDb;
