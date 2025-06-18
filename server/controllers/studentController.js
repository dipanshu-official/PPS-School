import Student from "../models/Student.js";
import jwt from "jsonwebtoken";

// Add a new student
export const addStudent = async (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
    } = req.body;

    // Normalize email: trim and lowercase

    // Check if student with email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    // Create new student
    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    const savedStudent = await newStudent.save();
    console.log("🚀 ~ addStudent ~ savedStudent:", savedStudent);

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: savedStudent,
    });
  } catch (error) {
    console.error("❌ Error in addStudent:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find student by email
    const student = await Student.findOne({ email: normalizedEmail });
    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if role matches
    // if (student.role !== role) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid role for this account",
    //   });
    // }

    // Verify password
    if (student.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        role: student.role,
      },
      process.env.JWT_SECRET || "your-secret-key", // Use environment variable
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // Prepare student data for response (exclude password)
    const studentData = {
      id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
     
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        student: studentData,
        token: token,
      },
    });
  } catch (error) {
    console.error("❌ Error in loginStudent:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { parentName: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const students = await Student.find(searchQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalStudents: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// Edit/Update student
export const editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    // Check if student exists
    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // If email is being updated, check for duplicates
    if (updateData.email && updateData.email !== existingStudent.email) {
      const emailExists = await Student.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Student with this email already exists",
        });
      }
    }

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Run model validations
    });

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};

export const getCurrentStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};
// Get student by email (utility function)
export const getStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const student = await Student.findOne({ email: email.toLowerCase() });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: deletedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};
