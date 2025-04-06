import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import DataBaseConnection from "./DataBase/DataBase.js";
import Userroutes from "./routes/user.routes.js";
// port assign in env file
const port = process.env.PORT || 3000;
const app = express();
// try to resolve cors issue
app.use(
  cors({
    origin: process.env.BASE_URL, // Replace with your frontend URL if different
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({})); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
// db connetion
DataBaseConnection();
app.use("/api/v1/users", Userroutes);
app.get("/", (req, res) => {
  res.send("hello");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
