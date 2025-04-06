import express from "express";
import { registerUser, verifyEMail } from "../Controller/user.controller.js";
const Userroutes = express.Router();

Userroutes.post("/register", registerUser);
Userroutes.get("/verify-email:token", registerUser);

export default Userroutes;
