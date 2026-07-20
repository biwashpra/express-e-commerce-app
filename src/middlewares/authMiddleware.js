import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

export const checkAuthenticate = async (req, res, next) => {
  let token;

  // Read JWT Cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch {
      res
        .status(403)
        .json({ success: false, error: "Forbidden, token failed." });
    }
  } else {
    res
      .status(401)
      .json({ success: false, error: "Not authorized, no token found." });
  }
};

export const checkIsAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ success: false, error: "Not authorized as admin." });
  }
};
