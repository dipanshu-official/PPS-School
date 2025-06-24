import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

// Import
import connectDB from "./config/db.js";
import studentRoutes from "./routes/students.js";
import teacherRoutes from "./routes/teachers.js";
import princpleRoutes from "./routes/principle.js";
import messageRoutes from "./routes/messageRoute.js";
import profileRoutes from "./routes/profile.js";
// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
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

// CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

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
app.use("/api/messages", messageRoutes);

const userSockets = new Map(); // userId => socket.id

io.on("connection", (socket) => {
  console.log("User connected:", userSockets, socket.id);

  // Register user with their userId
  socket.on("register", (userId) => {
    console.log("register event triggered");
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Handle sending a private message
  socket.on("send_message", ({ senderId, recipientId, content }) => {
    const recipientSocketId = userSockets.get(recipientId);
    console.log("message content", content);
    console.log("re", recipientSocketId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_message", {
        senderId,
        content,
        timestamp: new Date(),
      });
    } else {
      socket.emit("error", { message: "Recipient not online" });
    }
  });

  // Clean up on disconnect
  socket.on("disconnect", () => {
    for (const [userId, id] of userSockets.entries()) {
      if (id === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

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
export { io };
export default app;
