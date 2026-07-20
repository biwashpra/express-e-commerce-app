import User from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, data: users ?? [] });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { name, email } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;

    // Guard clause if body was empty or filled with junk keys
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid profile update data provided.",
      });
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
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    // Handle user doesnot exists.
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User account not found. Nothing was deleted.",
      });
    }

    res.status(200).json({
      success: true,
      message: `User account associated with ${deletedUser.email} has been permanently deleted.`,
    });
  } catch (error) {
    next(error);
  }
};
