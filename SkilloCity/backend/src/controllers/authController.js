import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/env.js';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

// POST /api/auth/register
export const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, role, college, year, department, subjects, bio } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists. Please log in instead.' });
        }

        const user = new User({
            firstName, lastName, email,
            passwordHash: password,
            role, college, year,
            department: department || '',
            subjects: subjects || [],
            teachingSubjects: role === 'teacher' ? (subjects || []) : [],
            bio: bio || '',
        });

        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({ user: user.toJSON(), token });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        user.isOnline = true;
        await user.save();
        const token = generateToken(user._id);
        res.json({ user: user.toJSON(), token });
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
    res.json({ user: req.user.toJSON() });
};

// POST /api/auth/reset-password
// Simple direct reset: user provides email + new password → password is updated
export const resetPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and new password are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address.' });
        }

        // Set new password (will be hashed by pre-save hook)
        user.passwordHash = password;
        await user.save();

        res.json({ message: 'Password updated successfully! You can now log in with your new password.' });
    } catch (error) {
        next(error);
    }
};
