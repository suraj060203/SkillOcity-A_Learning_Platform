import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetTutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    description: { type: String, default: '' },
    urgency: { type: String, enum: ['normal', 'urgent', 'exam-soon'], default: 'normal' },
    examDate: { type: Date, default: null },
    preferredTime: [{ type: String }],
    dayPreference: { type: String, enum: ['weekdays', 'weekends', 'any'], default: 'any' },
    attachment: { type: String, default: null },
    status: { type: String, enum: ['pending', 'accepted', 'declined', 'expired'], default: 'pending' },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            ret.postedAt = ret.createdAt;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
export default HelpRequest;
