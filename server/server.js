import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";


// Import
import connectDB from "./config/db.js";
import studentRoutes from "./routes/students.js";
import teacherRoutes from "./routes/teachers.js";
import princpleRoutes from "./routes/principle.js";
import messageRoutes from "./routes/messageRoute.js";
import profileRoutes from "./routes/profile.js";
import { server , app } from "./socket/socket.js";
// Load environment variables
dotenv.config();


const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);


// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", studentRoutes);
app.use("/api", teacherRoutes);
app.use("/api", princpleRoutes);
app.use("/api/user", profileRoutes);


// Routes
app.use("/api", messageRoutes);




app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "School Management System API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});
export default app;
