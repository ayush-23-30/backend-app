import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv(); 

const ConnectionWithDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB}/${process.env.MONGO_DB_NAME}`);
    console.log("DB is connected Successfully");
  } catch (error) {
    console.error("Error connecting to the DB:", error.message);
    process.exit(1);
  }
};


export default ConnectionWithDb;
