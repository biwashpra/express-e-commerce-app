import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_NAME, JWT_SECRET } from "../config/env.js";
import { COOKIE_CONFIG } from "../constants/cookie.js";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  // Set JWT as the Http-Only Cookie
  res.cookie(JWT_NAME, token, COOKIE_CONFIG);

  return token;
};

export default generateToken;
