import ChatGroup from "../models/chatGroupModel.js";
import  { io } from '../server.js';


// GET all groups for a user
export const getAllChatGroup = async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await ChatGroup.find({
      "members.userId": userId,
    }).sort({ lastActivity: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create new group
export const createNewchatGroup = async (req, res) => {
  try {
    const {
      name,
      description,
      createdBy,
      creatorUsername,
      isPrivate,
      maxMembers,
      avatar,
    } = req.body;

    const group = new ChatGroup({
      name,
      description,
      createdBy,
      isPrivate,
      maxMembers,
      avatar,
      members: [
        {
          userId: createdBy,
          username: creatorUsername,
          role: "principal",
        },
      ],
    });

    await group.save();

    // Emit to creator
    io.emit("group_created", {
      groupId: group._id,
      createdBy,
      group,
    });

    res.status(201).json(group);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

// GET group by ID
export const getChatGroup =  async (req, res) => {
  try {
    const group = await ChatGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update group by ID
export const updateChatGroup =  async (req, res) => {
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
};

//Delete group by ID
export const deleteChatGroup =  async (req, res) => {
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
};

// POST add member to group
export const addMember = async (req, res) => {
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
};
//Delete member to group
export const deleteMember = async (req, res) => {
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
};

