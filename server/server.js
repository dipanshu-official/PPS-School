import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";

// Import 
import connectDB from './config/db.js'
import studentRoutes from './routes/students.js';
import teacherRoutes from './routes/teachers.js';
import princpleRoutes from './routes/principle.js'
import courseRoutes from './routes/courses.js';
import attendanceRoutes from './routes/attendance.js';
import gradeRoutes from './routes/grades.js';
import dashboardRoutes from './routes/dashboard.js';
import chatGroupRoutes from './routes/chatGroupRoute.js'
import messageRoutes from './routes/messageRoute.js'
// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app)
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
connectDB()

// Routes
app.use('/api', studentRoutes);
app.use('/api', teacherRoutes);
app.use('/api', princpleRoutes);

app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Routes
app.use("/api/groups",chatGroupRoutes );
app.use("/api/messages",messageRoutes );

// Socket.IO Connection Handling
const activeUsers = new Map();
const userSockets = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins with their info
  socket.on("user_join", async (userData) => {
    const { userId, username } = userData;
    activeUsers.set(userId, { username, socketId: socket.id });
    userSockets.set(socket.id, userId);

    // Join user to their group rooms
    try {
      const userGroups = await ChatGroup.find({
        "members.userId": userId,
      }).select("_id");

      userGroups.forEach((group) => {
        socket.join(group._id.toString());
      });

      socket.emit("user_joined", { success: true });
    } catch (error) {
      socket.emit("error", { message: "Failed to join groups" });
    }
  });

  // Join specific group room
  socket.on("join_group", (groupId) => {
    socket.join(groupId);
    socket.emit("joined_group", groupId);
  });

  // Leave specific group room
  socket.on("leave_group", (groupId) => {
    socket.leave(groupId);
    socket.emit("left_group", groupId);
  });

  // Send message
  socket.on("send_message", async (messageData) => {
    try {
      const {
        groupId,
        senderId,
        senderName,
        content,
        messageType = "text",
      } = messageData;

      // Verify user is member of the group
      const group = await ChatGroup.findOne({
        _id: groupId,
        "members.userId": senderId,
      });

      if (!group) {
        socket.emit("error", {
          message: "Not authorized to send message to this group",
        });
        return;
      }

      // Save message to database
      const message = new Message({
        groupId,
        senderId,
        senderName,
        content,
        messageType,
      });

      await message.save();

      // Broadcast message to group members
      io.to(groupId).emit("new_message", {
        _id: message._id,
        groupId: message.groupId,
        senderId: message.senderId,
        senderName: message.senderName,
        content: message.content,
        messageType: message.messageType,
        createdAt: message.createdAt,
        edited: message.edited,
      });
    } catch (error) {
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Edit message
  socket.on("edit_message", async (data) => {
    try {
      const { messageId, newContent, userId } = data;

      const message = await Message.findOne({
        _id: messageId,
        senderId: userId,
      });

      if (!message) {
        socket.emit("error", {
          message: "Message not found or not authorized",
        });
        return;
      }

      message.content = newContent;
      message.edited = true;
      message.editedAt = new Date();
      await message.save();

      io.to(message.groupId.toString()).emit("message_edited", {
        messageId,
        newContent,
        editedAt: message.editedAt,
      });
    } catch (error) {
      socket.emit("error", { message: "Failed to edit message" });
    }
  });

  // Delete message
  socket.on("delete_message", async (data) => {
    try {
      const { messageId, userId } = data;

      const message = await Message.findOne({
        _id: messageId,
        senderId: userId,
      });

      if (!message) {
        socket.emit("error", {
          message: "Message not found or not authorized",
        });
        return;
      }

      const groupId = message.groupId.toString();
      await Message.findByIdAndDelete(messageId);

      io.to(groupId).emit("message_deleted", { messageId });
    } catch (error) {
      socket.emit("error", { message: "Failed to delete message" });
    }
  });

  // Typing indicators
  socket.on("typing_start", (data) => {
    socket.to(data.groupId).emit("user_typing", {
      userId: data.userId,
      username: data.username,
    });
  });

  socket.on("typing_stop", (data) => {
    socket.to(data.groupId).emit("user_stopped_typing", {
      userId: data.userId,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const userId = userSockets.get(socket.id);
    if (userId) {
      activeUsers.delete(userId);
      userSockets.delete(socket.id);
    }
    console.log("User disconnected:", socket.id);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'School Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});
export { io, activeUsers };
export default app;