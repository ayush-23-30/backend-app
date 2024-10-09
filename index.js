import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import ConnectionWithDb from "./config.js";
import router from "./router/User.router.js";
import NoteRouter from "./router/addNotes.routes.js";

configDotenv();

const app = express(); 

app.use(express.json()); 

// CORS configuration
app.use(cors({
  origin: "https://notes-app-client-omega.vercel.app", // No trailing slash
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allows credentials like cookies, tokens
}));

// Handle preflight requests
app.options('*', cors());

// Middleware to add CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://notes-app-client-omega.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Database connection
ConnectionWithDb(); 

app.get("/", (req, res) => {
  res.json({ data: "Hello backend server!" });
});

// Routing
app.use(router);
app.use(NoteRouter);

app.listen(process.env.PORT, () => {
  console.log("The server is running Fine");
});
