import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Update user profile 
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, email, zedId, mobile } = req.body;

    // Handle old profile image deletion
    if (req.file && user.profilePic) {
      const oldImagePath = path.join('uploads', path.basename(user.profilePic));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user details
    user.username = username || user.username;
    user.email = email || user.email;
    user.zedId = zedId || user.zedId;
    user.mobile = mobile || user.mobile;

    // New profile picture path
    if (req.file) {
      user.profilePic = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Password update logic
export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Incorrect current password' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();
    res.json({ msg: 'Password updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Fetch the indiviual user profile 
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user); // <-- ✅ This sends the profilePic as-is (should be /uploads/filename.jpg)
  } catch (err) {
    console.error('Profile load error:', err);
    res.status(500).json({ msg: 'Failed to fetch profile' });
  }
};
