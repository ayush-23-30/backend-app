import express from "express"
import cors from "cors"
import { configDotenv } from "dotenv";
import ConnectionWithDb from "./config.js";
import router from "./router/User.router.js";
import NoteRouter from "./router/addNotes.routes.js";
configDotenv();

const app = express(); 

app.use(express.json()); 

// app.use(cors({
//   origin: "*", // Update this to specific domains in production
// }));


app.use(cors({
  origin: ["https://notes-app-client-omega.vercel.app/"], // Replace with your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


ConnectionWithDb(); 

app.get("/", (req,res)=>{
  res.json({data : "Hello backend server! "})
}) // this is the way we make api keys to send data.. 

// routing 
app.use(router); 
app.use(NoteRouter); 

// app.use("/api/v1/",router); 
// app.use("/api/v1/",NoteRouter); 

app.listen(process.env.PORT , ()=>{
  console.log("The server is running Fine");
})

// Cors - middleware package for node and express that enables Cross-Origin Resourcess Sharing. it is a secuity feature implemented in web broswer to restict how a web page can interact with different origin(domain , port).. 