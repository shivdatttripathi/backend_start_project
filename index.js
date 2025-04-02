import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import DataBaseConnection from "./DataBase/DataBase.js";

dotenv.config(); // Load environment variables from .env file
const port = process.env.PORT || 3000; // Set the port from environment variable or default to 3000
const app = express();
app.use(
  cors({
    origin: process.env.BASE_URL, // Replace with your frontend URL if different
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({})); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

//http://localhost:4000/

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/name", (req, res) => {
  res.send("Hello World from name route");
});

app.listen(port, () => {
  DataBaseConnection(); // Call the database connection function

  console.log(`Server is running on port ${port} and connected to database`);
});
