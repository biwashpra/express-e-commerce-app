import express from "express";
import { PORT } from "./config/env.js";
import connectDB from "./config/database.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import responseMiddleware from "./middlewares/response.middleware.js";
import { checkAuthenticate } from "./middlewares/authMiddleware.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";

const app = express();

// necessary middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(responseMiddleware);

// routes configuration
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", checkAuthenticate, userRoute);

// self created middleware
// Error handler MUST be last
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
});
