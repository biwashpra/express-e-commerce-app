import { NODE_ENV } from "../config/env.js";

export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
