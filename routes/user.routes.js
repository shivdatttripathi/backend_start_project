import express from "express";
import { registerUser } from "../Controller/user.controller.js";
const Userroutes = express.Router();

Userroutes.post("/register", registerUser);

export default Userroutes;
