import User from '../models/User.js';

// GET /api/profile
export const getProfile = async (req, res) => {
    res.json(req.user.toJSON());
};

// PUT /api/profile
export const updateProfile = async (req, res, next) => {
    try {
        const allowedFields = [
            'firstName', 'lastName', 'college', 'year', 'department',
            'bio', 'subjects', 'teachingSubjects', 'availability', 'settings',
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.json(user.toJSON());
    } catch (error) {
        next(error);
    }
};

// POST /api/profile/avatar
export const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Cloudinary stores the URL in req.file.path
        const avatarUrl = req.file.path;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: avatarUrl },
            { new: true }
        );

        res.json({ url: avatarUrl, user: user.toJSON() });
    } catch (error) {
        next(error);
    }
};

// PUT /api/profile/settings
export const updateSettings = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { settings: { ...req.user.settings, ...req.body } } },
            { new: true }
        );

        res.json(user.toJSON());
    } catch (error) {
        next(error);
    }
};
