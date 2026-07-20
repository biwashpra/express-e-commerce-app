import { Router } from "express";
import { login, logout, signUp } from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post("/sign-up", signUp);
authRoute.post("/login", login);
authRoute.post("/logout", logout);

export default authRoute;
