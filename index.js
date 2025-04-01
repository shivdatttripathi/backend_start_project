import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Load environment variables from .env file
const port = process.env.PORT || 3000; // Set the port from environment variable or default to 3000
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL if different
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({})); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
//create a port number

//http://localhost:4000/

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/name", (req, res) => {
  res.send("Hello World from name route");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
