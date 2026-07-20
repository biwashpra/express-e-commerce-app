import { Router } from "express";
import { login, signUp } from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post("/sign-up", signUp);
authRoute.post("/login", login);

export default authRoute;
