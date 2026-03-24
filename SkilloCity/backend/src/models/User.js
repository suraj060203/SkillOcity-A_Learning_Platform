import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    college: { type: String, required: true, trim: true },
    year: { type: String, required: true },
    department: { type: String, default: '' },
    avatar: { type: String, default: null },
    bio: { type: String, default: '', maxlength: 500 },
    subjects: [{ type: String }],
    teachingSubjects: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    availability: {
        Mon: [String], Tue: [String], Wed: [String],
        Thu: [String], Fri: [String], Sat: [String], Sun: [String],
    },
    rating: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    studentsHelped: { type: Number, default: 0 },
    responseTime: { type: String, default: '' },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    settings: {
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true },
        sessionReminders: { type: Boolean, default: true },
        newRequestAlerts: { type: Boolean, default: true },
        messageNotifications: { type: Boolean, default: true },
        darkMode: { type: Boolean, default: false },
        language: { type: String, default: 'en' },
        availability: { type: String, enum: ['online', 'busy', 'offline'], default: 'online' },
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.passwordHash;
            // Computed fields
            ret.name = `${ret.firstName} ${ret.lastName}`;
            ret.memberSince = ret.createdAt;
            return ret;
        },
    },
});

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;
