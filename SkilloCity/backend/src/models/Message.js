import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    type: { type: String, enum: ['text', 'meet-link', 'file'], default: 'text' },
    meetLink: { type: String, default: null },
    fileUrl: { type: String, default: null },
    fileName: { type: String, default: null },
    read: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            ret.senderId = ret.sender;
            ret.timestamp = ret.createdAt;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});

// Index for efficient conversation message queries
messageSchema.index({ conversation: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
