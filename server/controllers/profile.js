
import Princple from "../models/Principal.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

export const getUserProfile = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let userData = null;

    switch (role) {
      case "student":
        userData = await Student.findById(userId).select("-password");
        break;

      case "teacher":
        userData = await Teacher.findById(userId).select("-password");
        break;

      case "principal":
        userData = await  Princple.findById(userId).select("-password");
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user role",
        });
    }

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `${role} profile fetched successfully`,
      data: userData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};

