import express from "express";
import { PORT } from "./config/env.js";
import connectDB from "./config/database.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";

const app = express();

// necessary middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// self created middleware
app.use(errorMiddleware);

// routes configuration
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
});
