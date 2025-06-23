import Princple from "../models/Principal.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils.js";


export const signupData = async (req, res) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email, password, role } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await Princple.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new Princple({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "principal", // Default role
    });

    const savedUser = await newUser.save();

    // Generate token
    const token = generateToken(savedUser._id,'principal');

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,

        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const loginData = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await Princple.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id,'principal');

    // Update last login (optional)
    user.lastLoginAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,

          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const logoutData = async (req, res) => {
  try {
    // Get user ID from the request (assuming it's set by authentication middleware)
    const userId = req.user?.id;

    if (userId) {
      // Update user's last logout time (optional)
      await Princple.findByIdAndUpdate(userId, {
        lastLogoutAt: new Date()
      });
    }

    // Since JWT tokens are stateless, we can't invalidate them server-side
    // The client should remove the token from their storage
    res.status(200).json({
      success: true,
      message: "Logout successful",
      data: {
        message: "Please remove the token from client storage"
      }
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
