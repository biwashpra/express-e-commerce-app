import express from "express";
import { PORT } from "./config/env.js";
import connectDB from "./config/database.js";

const app = express();

// necessary middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
});
