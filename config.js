import { configDotenv } from "dotenv";
import mongoose from "mongoose";


configDotenv(); 
const ConnectionWithDb = async ()=>{
    await mongoose.connect(process.env.MONGO_DB)
    .then(()=>{
      console.log("DB is connected Successfully");
    }).catch((error)=>{
      console.error("there is an error in the connection establishing with db");
      process.exit(1); 
    })
}

export default ConnectionWithDb; 