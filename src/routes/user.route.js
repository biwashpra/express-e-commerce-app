import { Router } from "express";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { checkIsAdmin } from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.get("/", checkIsAdmin, getAllUsers);
userRouter.get("/profile", getUserProfile);
userRouter.patch("/updateProfile", updateUserProfile);
userRouter.delete("/:id", checkIsAdmin, deleteUserById);
userRouter.get("/:id", checkIsAdmin, getUserById);

export default userRouter;
