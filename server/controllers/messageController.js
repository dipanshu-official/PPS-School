import { Conversation } from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    console.log("Sender ID:", req.id);

    const receiverId = req.params.id;
    console.log("Receiver ID:", req.params.id);

    const { message } = req.body;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid sender or receiver ID" });
    }

    // ✅ Convert to ObjectId
    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderObjectId, receiverObjectId] },
    });

    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participants: [senderObjectId, receiverObjectId],
        messages: [],
      });
    }

    const newMessage = await Message.create({
      senderId: senderObjectId,
      receiverId: receiverObjectId,
      message,
    });

    if (newMessage) {
      gotConversation.messages.push(newMessage._id);
      await gotConversation.save();
      return res.status(201).json(newMessage);
    } else {
      return res.status(500).json({ message: "Message creation failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({ message: "No conversation found" });
    }

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};

