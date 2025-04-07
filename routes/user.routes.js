import express from "express";
import {
  login,
  registerUser,
  verifyEMail,
} from "../Controller/user.controller.js";
const UserRoutes = express.Router();

UserRoutes.post("/register", registerUser);
// UserRoutes.get("/verify-email/token", verifyEMail);
UserRoutes.get("/verify-email/:token", verifyEMail);
UserRoutes.post("/login", login);
export default UserRoutes;
