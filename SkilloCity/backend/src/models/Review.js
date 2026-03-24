import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', default: null },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, default: '' },
    subject: { type: String, default: '' },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            ret.date = ret.createdAt;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});

// One review per session (only enforced when session is set)
reviewSchema.index({ session: 1 }, { unique: true, partialFilterExpression: { session: { $type: 'objectId' } } });
// Index for teacher reviews lookup
reviewSchema.index({ teacher: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
