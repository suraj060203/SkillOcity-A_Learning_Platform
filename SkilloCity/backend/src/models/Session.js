import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    helpRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'HelpRequest', default: null },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    meetLink: { type: String, default: null },
    notes: { type: String, default: '' },
    reviewed: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
