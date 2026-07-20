import { config } from "dotenv";

config({ path: ".env" });

export const { NODE_ENV, PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN } =
  process.env;
