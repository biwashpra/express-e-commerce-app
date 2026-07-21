import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.success({ data: users ?? [], message: "Users retrived successfully" });
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User account not found.");
  }

  res.success({
    data: user,
    message: "User profile retrived successfully.",
  });
};

export const updateUserProfile = async (req, res) => {
  const id = req.user._id;
  const { name, email } = req.body;

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (email !== undefined) updateFields.email = email;

  // Guard clause if body was empty or filled with junk keys
  if (Object.keys(updateFields).length === 0) {
    throw new AppError(
      400,
      "INVALID_UPDATE_DATA",
      "No valid profile update data provided.",
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateFields },
    {
      new: true, // Returns the modified document rather than the old one
      runValidators: true, // Forces Mongoose schema validators to run on the update
    },
  );

  if (!updatedUser) {
    throw new AppError(404, "USER_NOT_FOUND", "User account not found.");
  }

  return res.success({
    message: "Profile updated successfully.",
    data: updatedUser,
  });
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id);

  // Handle user doesnot exists.
  if (!deletedUser) {
    throw new AppError(404, "USER_NOT_FOUND", "User account not found.");
  }

  res.success({
    message: `User account associated with ${deletedUser.email} has been permanently deleted.`,
  });
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User account not found.");
  }

  res.success({ data: user, message: "User data reterived successfully." });
};

export const updateUserById = async (req, res) => {
  const { id } = req.params;

  const { name, email, isAdmin } = req.body;

  const updatedFields = {};
  if (name !== undefined) updatedFields.name = name;
  if (email !== undefined) updatedFields.email = email;
  if (isAdmin !== undefined) updatedFields.isAdmin = isAdmin;

  // Guard clause if body was empty or filled with junk keys
  if (Object.keys(updatedFields).length === 0) {
    throw new AppError(
      400,
      "INVALID_UPDATE_DATA",
      "No valid user update data provided.",
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updatedFields },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    throw new AppError(404, "USER_NOT_FOUND", "User account not found.");
  }

  res.success({
    message: "User data updated successfully",
    data: updatedUser,
  });
};
