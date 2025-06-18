import Teacher from "../models/Teacher.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Add Teacher
export const addTeacher = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: firstName, lastName, email, password",
      });
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new teacher
    const newTeacher = new Teacher({
      firstName,
      lastName,
      email,
      password: hashedPassword,
     
    });

    await newTeacher.save();

    // Remove password from response
    const teacherResponse = newTeacher.toObject();
    delete teacherResponse.password;

    res.status(201).json({
      success: true,
      message: "Teacher added successfully",
      data: teacherResponse,
    });
  } catch (error) {
    console.error("Error adding teacher:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Login Teacher
export const loginTeacher = async (req, res) => {
  try {
    const { email, password,  } = req.body;

    // Validation
    if (!email || !password ) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password T ",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password P",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        teacherId: teacher._id,
        email: teacher.email,
        role: "teacher",
      },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" }
    );

    // Remove password from response
    

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        teacher,
        token,
       
      },
    });
  } catch (error) {
    console.error("Error logging in teacher:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get All Teachers
export const getAllTeachers = async (req, res) => {
  try {
    console.log("custom req",req.shiva)
    if (req.shiva.role != "principal") {
      res.status(401).json("you are not a pricipal");
      return
    }
    const teachers = await Teacher.find({}).select("-password");
console.log("header value",req.headers.authorization)
    res.status(200).json({
      success: true,
      message: "Teachers retrieved successfully",
      data: teachers,
      count: teachers.length,
    });
  } catch (error) {
    console.error("Error getting teachers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id).select("-password");
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher retrieved successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Error getting teacher by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update Teacher
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove password from updates if provided (handle separately)
    if (updates.password) {
      delete updates.password;
    }

    const teacher = await Teacher.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update Teacher Password
export const updateTeacherPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current password and new password",
      });
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      teacher.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    teacher.password = hashedNewPassword;
    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating teacher password:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Teachers by Department
export const getTeachersByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const teachers = await Teacher.find({ department }).select("-password");

    res.status(200).json({
      success: true,
      message: `Teachers from ${department} department retrieved successfully`,
      data: teachers,
      count: teachers.length,
    });
  } catch (error) {
    console.error("Error getting teachers by department:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Search Teachers
export const searchTeachers = async (req, res ,next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query",
      });
    }

    const teachers = await Teacher.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { department: { $regex: query, $options: "i" } },
        { subjects: { $in: [new RegExp(query, "i")] } },
      ],
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Search completed successfully",
      data: teachers,
      count: teachers.length,
    });
  } catch (error) {
    console.error("Error searching teachers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
