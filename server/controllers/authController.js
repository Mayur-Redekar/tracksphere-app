import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.FRONTEND_URL;

const colorOptions = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8',
  '#f58231', '#911eb4', '#46f0f0', '#f032e6',
];

// User Registration
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const usedColors = (await User.find({})).map((u) => u.color);
    const availableColors = colorOptions.filter((c) => !usedColors.includes(c));
    const color = availableColors[Math.floor(Math.random() * availableColors.length)];
    if (!color) return res.status(400).json({ msg: 'No colors left' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email: cleanEmail,
      password: hashedPassword,
      color,
      role: 'user',
      isVerified: false, // Admin verifies manually
    });

    await newUser.save();

    // Send SSE notification to all connected clients
    const clients = req.app.get('sseClients') || [];
    const message = JSON.stringify({
      type: 'new_user_registered',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isVerified: false,
      },
    });

    clients.forEach(client => {
      client.write(`data: ${message}\n\n`);
    });

    res.status(201).json({ msg: 'Registration successful. Awaiting admin verification.' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// Login only if verified
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    if (!user.isVerified)
      return res.status(403).json({ msg: 'Account not verified by admin yet' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        color: user.color,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ msg: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token: newAccessToken });
  } catch (err) {
    console.error('Refresh token error:', err.message);
    return res.status(403).json({ msg: 'Invalid or expired refresh token' });
  }
};

// Admin verifies user manually
export const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true }
    );

    res.status(200).json({ msg: `User verification updated`, user });
  } catch (err) {
    console.error('❌ Verify toggle error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete the user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err.message);
    res.status(500).json({ msg: 'Error deleting user' });
  }
};




