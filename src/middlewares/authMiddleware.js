import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

export const checkAuthenticate = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AppError(
      401,
      "UNAUTHORIZED",
      "Authentication required. No token provided.",
    );
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new AppError(
      401,
      "USER_NOT_FOUND",
      "The authenticated user no longer exists.",
    );
  }

  req.user = user;

  next();
};

export const checkIsAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new AppError(
      403,
      "FORBIDDEN",
      "You do not have permission to perform this action.",
    );
  }
};
