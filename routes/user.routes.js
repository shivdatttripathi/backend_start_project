import express from "express";
import {
  forgotPassword,
  isMe,
  login,
  logOutUser,
  registerUser,
  resetPassword,
  verifyEMail,
} from "../Controller/user.controller.js";
//auth import
import { checkedLoggedIn } from "../middleware/auth.middleware.js";
const UserRoutes = express.Router();

UserRoutes.post("/register", registerUser);
// UserRoutes.get("/verify-email/token", verifyEMail);
UserRoutes.get("/verify-email/:token", verifyEMail);
UserRoutes.post("/login", login);
UserRoutes.get("/isme", checkedLoggedIn, isMe);
UserRoutes.post("/forgot", forgotPassword);
UserRoutes.post("/reset", resetPassword);
UserRoutes.get("/logout", logOutUser);

export default UserRoutes;
