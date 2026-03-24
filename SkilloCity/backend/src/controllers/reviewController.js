import Review from '../models/Review.js';
import Session from '../models/Session.js';
import User from '../models/User.js';

// GET /api/reviews/:teacherId
export const getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ teacher: req.params.teacherId })
            .populate('reviewer', 'firstName lastName college avatar')
            .sort({ createdAt: -1 });

        const result = reviews.map(r => {
            const rJson = r.toJSON();
            if (r.reviewer) {
                rJson.reviewer = {
                    name: `${r.reviewer.firstName} ${r.reviewer.lastName}`,
                    college: r.reviewer.college,
                    avatar: r.reviewer.avatar,
                };
            }
            return rJson;
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// POST /api/reviews
export const createReview = async (req, res, next) => {
    try {
        const { sessionId, teacherId, rating, text, subject } = req.body;

        // Validate session exists and belongs to the reviewer
        if (sessionId) {
            const session = await Session.findById(sessionId);
            if (!session) return res.status(404).json({ message: 'Session not found.' });
            if (session.student.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'You can only review your own sessions.' });
            }
            if (session.reviewed) {
                return res.status(400).json({ message: 'This session has already been reviewed.' });
            }

            session.reviewed = true;
            await session.save();
        }

        const review = new Review({
            session: sessionId || null,
            reviewer: req.user._id,
            teacher: teacherId,
            rating,
            text: text || '',
            subject: subject || '',
        });
        await review.save();

        // Update teacher's average rating
        const allReviews = await Review.find({ teacher: teacherId });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await User.findByIdAndUpdate(teacherId, {
            rating: Math.round(avgRating * 10) / 10,
        });

        res.status(201).json(review.toJSON());
    } catch (error) {
        next(error);
    }
};
