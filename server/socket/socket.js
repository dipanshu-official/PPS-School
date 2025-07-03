import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import Principal from "../models/Principal.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Message from "../models/messageModel.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = {}; // userId -> { socketId, role }

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId]?.socketId;
};

io.on("connection", async (socket) => {
  console.log("socket=>",socket.id)
  const userId = socket.handshake.query.userId;
  if (!userId) return;

  let role = null;
  if (await Principal.findOne({ userId })) role = "principal";
  else if (await Teacher.findOne({ userId })) role = "teacher";
  else if (await Student.findOne({ userId })) role = "student";

  if (!role) {
    socket.emit("error", "User not found");
    return;
  }

  userSocketMap[userId] = { socketId: socket.id, role };
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("send-message", async ({ from, to, message }) => {
    const sender = userSocketMap[from];
    const receiver = userSocketMap[to];

    if (!sender || !receiver) return;

    const isAllowed =
      (sender.role === "principal" && receiver.role === "teacher") ||
      (sender.role === "teacher" && receiver.role === "student");

    if (!isAllowed) {
      socket.emit("error", "You are not allowed to send message to this user");
      return;
    }

    await Message.create({ from, to, message });

    const targetSocket = receiver.socketId;
    if (targetSocket) {
      io.to(targetSocket).emit("receive-message", { from, message });
    }
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});



export { app, io, server };
