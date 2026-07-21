import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { JWT_NAME } from "../config/env.js";
import { COOKIE_CONFIG } from "../constants/cookie.js";
import AppError from "../utils/AppError.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError(
        400,
        "MISSING_REQUIRED_FIELDS",
        "Please fill all required fields.",
      );
    }

    // Check if user already exists
    const userExists = await User.findOne({ email }, "-password");

    if (userExists) {
      throw new AppError(
        409,
        "EMAIL_ALREADY_EXISTS",
        "An account with this email already exists.",
      );
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

    return res.success({
      statusCode: 201,
      data: cleanUser,
      message: "User created successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError(
      400,
      "MISSING_REQUIRED_FIELDS",
      "Please fill all required fields.",
    );
  }

  // Check user exists or not
  const userExists = await User.findOne({ email }, "+password");

  // User doesn't exist - stop.
  if (!userExists) {
    throw new AppError(404, "USER_NOT_FOUND", "User account not found.");
  }

  // User exists then compare the password
  const isPasswordValid = await bcrypt.compare(
    String(password),
    userExists.password,
  );

  // Password doesn't match
  if (!isPasswordValid) {
    throw new AppError(
      400,
      "INVALID_CREDENTIALS",
      "Invalid email or password.",
    );
  }

  // Password is valid - create token
  generateToken(res, userExists._id);

  const cleanUser = userExists.toObject();
  delete cleanUser.password;
  delete cleanUser.__v;

  return res.success({
    statusCode: 201,
    data: cleanUser,
    message: "Login successfully",
  });
};

export const logout = async (req, res) => {
  res.cookie(JWT_NAME, "", COOKIE_CONFIG);

  res.success({ message: "Logout successfully" });
};
