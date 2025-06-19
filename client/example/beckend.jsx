// server.js
import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import chatGroupRoutes from './routes/chatGroups.js';
import messageRoutes from './routes/messages.js';
import { ChatGroup, Message } from './models/index.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatgroups')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/groups', chatGroupRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO Connection Handling
const activeUsers = new Map();
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their info
  socket.on('user_join', async (userData) => {
    const { userId, username } = userData;
    activeUsers.set(userId, { username, socketId: socket.id });
    userSockets.set(socket.id, userId);
    
    // Join user to their group rooms
    try {
      const userGroups = await ChatGroup.find({
        'members.userId': userId
      }).select('_id');
      
      userGroups.forEach(group => {
        socket.join(group._id.toString());
      });
      
      socket.emit('user_joined', { success: true });
    } catch (error) {
      socket.emit('error', { message: 'Failed to join groups' });
    }
  });

  // Join specific group room
  socket.on('join_group', (groupId) => {
    socket.join(groupId);
    socket.emit('joined_group', groupId);
  });

  // Leave specific group room
  socket.on('leave_group', (groupId) => {
    socket.leave(groupId);
    socket.emit('left_group', groupId);
  });

  // Send message
  socket.on('send_message', async (messageData) => {
    try {
      const { groupId, senderId, senderName, content, messageType = 'text' } = messageData;
      
      // Verify user is member of the group
      const group = await ChatGroup.findOne({
        _id: groupId,
        'members.userId': senderId
      });
      
      if (!group) {
        socket.emit('error', { message: 'Not authorized to send message to this group' });
        return;
      }
      
      // Save message to database
      const message = new Message({
        groupId,
        senderId,
        senderName,
        content,
        messageType
      });
      
      await message.save();
      
      // Broadcast message to group members
      io.to(groupId).emit('new_message', {
        _id: message._id,
        groupId: message.groupId,
        senderId: message.senderId,
        senderName: message.senderName,
        content: message.content,
        messageType: message.messageType,
        createdAt: message.createdAt,
        edited: message.edited
      });
      
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Edit message
  socket.on('edit_message', async (data) => {
    try {
      const { messageId, newContent, userId } = data;
      
      const message = await Message.findOne({
        _id: messageId,
        senderId: userId
      });
      
      if (!message) {
        socket.emit('error', { message: 'Message not found or not authorized' });
        return;
      }
      
      message.content = newContent;
      message.edited = true;
      message.editedAt = new Date();
      await message.save();
      
      io.to(message.groupId.toString()).emit('message_edited', {
        messageId,
        newContent,
        editedAt: message.editedAt
      });
      
    } catch (error) {
      socket.emit('error', { message: 'Failed to edit message' });
    }
  });

  // Delete message
  socket.on('delete_message', async (data) => {
    try {
      const { messageId, userId } = data;
      
      const message = await Message.findOne({
        _id: messageId,
        senderId: userId
      });
      
      if (!message) {
        socket.emit('error', { message: 'Message not found or not authorized' });
        return;
      }
      
      const groupId = message.groupId.toString();
      await Message.findByIdAndDelete(messageId);
      
      io.to(groupId).emit('message_deleted', { messageId });
      
    } catch (error) {
      socket.emit('error', { message: 'Failed to delete message' });
    }
  });

  // Typing indicators
  socket.on('typing_start', (data) => {
    socket.to(data.groupId).emit('user_typing', {
      userId: data.userId,
      username: data.username
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(data.groupId).emit('user_stopped_typing', {
      userId: data.userId
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = userSockets.get(socket.id);
    if (userId) {
      activeUsers.delete(userId);
      userSockets.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io, activeUsers };

// models/index.js
import mongoose from 'mongoose';

// Chat Group Schema
const chatGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  members: [{
    userId: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: String,
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  maxMembers: {
    type: Number,
    default: 100
  },
  avatar: {
    type: String,
    default: null
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Message Schema
const messageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatGroup',
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
chatGroupSchema.index({ 'members.userId': 1 });
chatGroupSchema.index({ createdBy: 1 });
messageSchema.index({ groupId: 1, createdAt: -1 });

export const ChatGroup = mongoose.model('ChatGroup', chatGroupSchema);
export const Message = mongoose.model('Message', messageSchema);

// routes/chatGroups.js
import express from 'express';
import { ChatGroup, Message } from '../models/index.js';
import { io } from '../server.js';

const router = express.Router();

// GET all groups for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await ChatGroup.find({
      'members.userId': userId
    }).sort({ lastActivity: -1 });
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await ChatGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new group
router.post('/', async (req, res) => {
  try {
    const { name, description, createdBy, creatorUsername, isPrivate, maxMembers, avatar } = req.body;
    
    const group = new ChatGroup({
      name,
      description,
      createdBy,
      isPrivate,
      maxMembers,
      avatar,
      members: [{
        userId: createdBy,
        username: creatorUsername,
        role: 'admin'
      }]
    });
    
    await group.save();
    
    // Emit to creator
    io.emit('group_created', {
      groupId: group._id,
      createdBy,
      group
    });
    
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update group
router.put('/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await ChatGroup.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    // Check if user is admin
    const member = group.members.find(m => m.userId === userId);
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update group' });
    }
    
    const updates = req.body;
    delete updates.userId; // Remove userId from updates
    
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        group[key] = updates[key];
      }
    });
    
    await group.save();
    
    // Emit to group members
    io.to(group._id.toString()).emit('group_updated', {
      groupId: group._id,
      updates: group
    });
    
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE group
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await ChatGroup.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    // Check if user is admin or creator
    const member = group.members.find(m => m.userId === userId);
    if (group.createdBy !== userId && (!member || member.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized to delete group' });
    }
    
    await ChatGroup.findByIdAndDelete(req.params.id);
    await Message.deleteMany({ groupId: req.params.id });
    
    // Emit to group members
    io.to(group._id.toString()).emit('group_deleted', {
      groupId: group._id
    });
    
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add member to group
router.post('/:id/members', async (req, res) => {
  try {
    const { userId, username, addedBy } = req.body;
    const group = await ChatGroup.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    // Check if adding user is admin
    const adder = group.members.find(m => m.userId === addedBy);
    if (!adder || adder.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can add members' });
    }
    
    // Check if user is already a member
    if (group.members.some(m => m.userId === userId)) {
      return res.status(400).json({ error: 'User is already a member' });
    }
    
    // Check member limit
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ error: 'Group is full' });
    }
    
    group.members.push({
      userId,
      username,
      role: 'member'
    });
    
    await group.save();
    
    // Emit to group members
    io.to(group._id.toString()).emit('member_added', {
      groupId: group._id,
      newMember: { userId, username, role: 'member' }
    });
    
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE remove member from group
router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { removedBy } = req.body;
    const group = await ChatGroup.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    // Check if removing user is admin or removing themselves
    const remover = group.members.find(m => m.userId === removedBy);
    if (userId !== removedBy && (!remover || remover.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized to remove member' });
    }
    
    group.members = group.members.filter(m => m.userId !== userId);
    await group.save();
    
    // Emit to group members
    io.to(group._id.toString()).emit('member_removed', {
      groupId: group._id,
      removedUserId: userId
    });
    
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

// routes/messages.js
import express from 'express';
import { Message, ChatGroup } from '../models/index.js';

const router = express.Router();

// GET messages for a group
router.get('/group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({ groupId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single message
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT edit message
router.put('/:id', async (req, res) => {
  try {
    const { content, userId } = req.body;
    
    const message = await Message.findOne({
      _id: req.params.id,
      senderId: userId
    });
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found or not authorized' });
    }
    
    message.content = content;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();
    
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE message
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const message = await Message.findOne({
      _id: req.params.id,
      senderId: userId
    });
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found or not authorized' });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

// package.json
{
  "name": "chat-group-api",
  "version": "1.0.0",
  "description": "Chat Group CRUD API with Socket.IO",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "socket.io": "^4.7.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}

// .env
MONGODB_URI=mongodb://localhost:27017/chatgroups
PORT=3000