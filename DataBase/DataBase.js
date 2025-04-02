import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
const DataBase_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/project1";
const DataBaseConnection = () => {
  try {
    mongoose.connect(DataBase_URL);
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
export default DataBaseConnection;
