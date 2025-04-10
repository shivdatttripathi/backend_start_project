import jwt from "jsonwebtoken";
const checkedLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) {
      return res.status(401).json({
        message: "Auth failed: Token missing",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next(); // ✅ Only call next here
  } catch (error) {
    console.log("Error in auth middleware:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export { checkedLoggedIn };
