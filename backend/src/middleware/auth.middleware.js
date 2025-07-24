import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password"); // fetched the user from DB. APIs should always limit sensitive data exposure and You don’t need the password to check if a user is valid..
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    req.user = user; // saving it inside the req object. In your next function (updateprofile), you can use const userId = req.user._id;
    next();
  } catch (error) {
    console.log("Error in protect route middleware", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
