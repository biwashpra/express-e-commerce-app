import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { JWT_NAME } from "../config/env.js";
import { COOKIE_CONFIG } from "../constants/cookie.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ success: false, error: "Please fill all required fields" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email }, "-password");

    if (userExists) {
      res.status(409).json({ success: false, error: "User already exists" });
    }

    // Hash the plain text password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(password), salt);

    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      {
        session,
      },
    );

    generateToken(res, newUsers[0]._id);

    await session.commitTransaction();
    await session.endSession();

    const cleanUser = newUsers[0].toObject({
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.updatedAt;
        delete ret.__v;
        return ret;
      },
    });

    res.status(201).json({
      success: true,
      data: cleanUser,
      message: "User created successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, error: "Please fill all required fields" });
    }

    // Check user exists or not
    const userExists = await User.findOne({ email }, "+password");

    // User doesn't exist - stop.
    if (!userExists) {
      res.status(404).json({
        success: false,
        error: "User doesn't exist.",
      });
    }

    // User exists then compare the password
    const isPasswordValid = await bcrypt.compare(
      String(password),
      userExists.password,
    );

    // Password doesn't match
    if (!isPasswordValid) {
      res.status(401).json({ success: false, error: "Passwords do not match" });
    }

    // Password is valid - create token
    generateToken(res, userExists._id);

    const cleanUser = userExists.toObject();
    delete cleanUser.password;
    delete cleanUser.__v;

    res.status(201).json({
      success: true,
      data: cleanUser,
      message: "Login successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie(JWT_NAME, COOKIE_CONFIG);

    res.status(200).json({ success: true, message: "Logout successfully" });
  } catch (error) {
    next(error);
  }
};
