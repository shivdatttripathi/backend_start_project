import User from "../model/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  forgotPasswordMail,
  registerUserSendEmail,
} from "../utils/emailCall.js";
// register controller
const registerUser = async (req, res) => {
  console.log("register route");
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(401).json({ message: "all field are require" });
  try {
    console.log(email);

    const userExist = await User.findOne({ email }); // check user exixst baised on email
    if (userExist)
      return res.status(400).json({ message: "user alredy exist" });
    const user = await User.create({
      name,
      email,
      password,
    });
    if (!User) {
      res.status(401).json({
        message: "user not register",
      });
    }
    const token = crypto.randomBytes(22).toString("hex");

    console.log(token);
    user.verificationToken = token;
    await user.save();
    console.log(user.verificationToken);

    // send mail using nodemailer and service use MailTrap
    registerUserSendEmail();
    res.status(201).json({
      message: "register succsesful and mail run",
      success: true,
      user,
    });
  } catch (error) {
    console.log("error in register", error);
  }
};
// email verify controller

const verifyEMail = async (req, res) => {
  //   console.log("verify mail run");
  //   const token = String(req.params.token).trim(); // safely convert to string
  //   console.log("token coming", token);
  //   if (!token) {
  //     return res.status(401).json({
  //       message: "invaild verify",
  //       success: false,
  //     });
  //   }
  //   // const authtoken = token.toString();
  //   if (token === "4045faf41d060e6f88b7ae27514593cc20fdae244467") {
  //     console.log("token is match");
  //   }
  //   // find user using token
  //   try {
  //     // const user = await User.findOne({ verificationToken });
  //     const user = await User.findOne({
  //       verificationToken: token,
  //     });
  //     console.log(user);
  //     if (!user) {
  //       return res.status(401).json({
  //         message: "invaild token or exprire",
  //         success: false,
  //       });
  //     }
  //     console.log(user);
  //     user.isVerified = true;
  //     user.verificationToken = undefined;
  //     await user.save();
  //     res
  //       .status(200)
  //       .json({
  //         message: "verification sucessful you login and ",
  //       })
  //       .send("verifed");
  //   } catch (error) {
  //     console.log("verify email error", error);
  //   }
};

// login user  controller

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return res.status(400).json({
      message: "all field requireds",
      success: false,
    });
  }

  try {
    const user = await User.findOne({ email });
    console.log("login user", user);
    if (!user) {
      return res.status(400).json({
        message: "email password wrong",
        success: false,
      });
    }
    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("ismatch", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "email password wrong",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const cookieOption = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("authToken", token, cookieOption);

    return res.status(200).json({
      message: "user login sucessfull",
      user: {
        name: user.name,
        email: user.email,
        token,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("user login error", error);
  }
};
// check profile controller

const isMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -isVerified"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    return res.status(200).json({
      message: "User profile matched",
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in isMe:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logOutUser = async (req, res) => {
  res.cookie("authToken", "", {
    expiresIn: new Date(0), // is 0 means 1971 date time 00:00:00
  });
};

// forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(401).json({
      message: "please fill all field ",
      success: false,
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "account can't found ",
      success: false,
    });
  }
  const token = crypto.randomBytes(22).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpire = new Date() + 10 * 60 * 1000;
  user.save();
  forgotPasswordMail(user, token);
  return res.status(200).json({
    message: "reset link send in your email",
    success: true,
  });
};
const resetPassword = async (req, res) => {};

export {
  registerUser,
  verifyEMail,
  login,
  isMe,
  resetPassword,
  forgotPassword,
  logOutUser,
};
