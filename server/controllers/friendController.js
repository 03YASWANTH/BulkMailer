const Friend = require('../models/friend');

// Add a new friend
exports.addFriend = async (req, res) => {
  try {
    const { name, email, upiId } = req.body;
    const userId = req.user.id; // Assuming user info is stored in req.user after authentication
    const newFriend = new Friend({ userId, name, email, upiId });
    await newFriend.save();
    res.status(201).json({ success: true, message: 'Friend added successfully', friend: newFriend });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all friends of the authenticated user
exports.getAllFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const friends = await Friend.find({ userId });
    res.status(200).json({ success: true, friends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single friend by ID
exports.getFriendById = async (req, res) => {
  try {
    const { id } = req.params;
    const friend = await Friend.findOne({ _id: id, userId: req.user.id }).populate('paymentHistory');
    if (!friend) {
      return res.status(404).json({ success: false, message: 'Friend not found' });
    }
    res.status(200).json({ success: true, friend });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a friend's details
exports.updateFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = Date.now();

    const updatedFriend = await Friend.findOneAndUpdate({ _id: id, userId: req.user.id }, updates, { new: true });
    if (!updatedFriend) {
      return res.status(404).json({ success: false, message: 'Friend not found' });
    }
    res.status(200).json({ success: true, message: 'Friend updated successfully', friend: updatedFriend });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a friend
exports.deleteFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFriend = await Friend.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedFriend) {
      return res.status(404).json({ success: false, message: 'Friend not found' });
    }
    res.status(200).json({ success: true, message: 'Friend deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
