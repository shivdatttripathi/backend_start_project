import User from "../model/User.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const registerUser = async (req, res) => {
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
    console.log(user);
    const token = crypto.randomBytes(22).toString("hex");

    console.log(token);
    User.verifcationToken = token;
    await user.save();

    // send mail using nodemailer and service use MailTrap
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
    const mailOption = {
      from: process.env.MAILTRAP_SenderMail, // sender address
      to: user.email, // reciver email i choise user email
      subject: "Verification mail", // Subject line
      text: `please click following link for verify email if u not register not click
      ${process.env.BASE_URL}/api/v1/users/verify-email${token}`, // plain text body
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Verify Email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            background-color: #fff;
            padding: 30px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .btn {
            background-color: #007bff;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Verify Your Email Address</h2>
          <p>Hello ${user.name || "there"},</p>
          <p>Thank you for signing up. Please click the button below to verify your email:</p>
          <a href="${
            process.env.BASE_URL
          }/api/v1/users/verify-email:${token}" class="btn">Verify Email</a>
          <p>If you did not request this, please ignore this message.</p>
          <div class="footer">
            <p>&copy; 2025 LetsCode</p>
          </div>
        </div>
      </body>
      </html>`, // html body
    };
    await transporter.sendMail(mailOption);

    res.status(201).json({
      message: "register succsesful and mail run",
      success: true,
    });
  } catch (error) {
    console.log("error in register", error);
  }
};
const verifyEMail = async () => {
  console.log("verify mail run");
  const { token } = req.params;
  console.log(token);
  if (!token) {
    return res.status(401).json({
      message: "invaild verify",
      success: false,
    });
  }
  // find user using token
  try {
    const user = await User.findOne({ verifcationToken: token });
    if (!user) {
      return res.status(401).json({
        message: "invaild token or exprire",
        success: false,
      });
    }
    user.isVerified = true;

    user.verifcationToken = undefined;

    await user.save();
    res
      .status(200)
      .json({
        message: "verification sucessful you login and ",
      })
      .send("verifed");
  } catch (error) {
    console.log("verify email error", error);
  }
};

export { registerUser, verifyEMail };
