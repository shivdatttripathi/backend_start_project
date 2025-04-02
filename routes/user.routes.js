import express from "express";
import { getUser } from "../Controller/user.controller.js";
const Userroutes = express.Router();

Userroutes.get("/", getUser);

export default Userroutes;
