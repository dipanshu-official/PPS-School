import Message from "../models/messageModel.js";

// GET messages for a group
export const getMessage = async (req, res) => {
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
};

// GET single message
export const singleMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT edit message
export const editMessage = async (req, res) => {
  try {
    const { content, userId } = req.body;

    const message = await Message.findOne({
      _id: req.params.id,
      senderId: userId,
    });

    if (!message) {
      return res
        .status(404)
        .json({ error: "Message not found or not authorized" });
    }

    message.content = content;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE message
export const deleteMessage = async (req, res) => {
  try {
    const { userId } = req.body;

    const message = await Message.findOne({
      _id: req.params.id,
      senderId: userId,
    });

    if (!message) {
      return res
        .status(404)
        .json({ error: "Message not found or not authorized" });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


