import User from '../models/User.js';
import Review from '../models/Review.js';

// GET /api/tutors
export const getTutors = async (req, res, next) => {
    try {
        const { subject, onlineOnly, minRating, search, sortBy } = req.query;

        let filter = { role: 'teacher' };

        if (subject) filter.subjects = subject;
        if (onlineOnly === 'true') filter.isOnline = true;
        if (minRating) filter.rating = { $gte: parseFloat(minRating) };
        if (search) {
            const q = new RegExp(search, 'i');
            filter.$or = [
                { firstName: q }, { lastName: q }, { college: q },
                { subjects: q }, { bio: q }, { department: q },
            ];
        }

        let sort = {};
        if (sortBy === 'rating') sort = { rating: -1 };
        else if (sortBy === 'sessions') sort = { totalSessions: -1 };
        else sort = { totalSessions: -1 };

        const tutors = await User.find(filter).sort(sort).select('-settings');

        // Attach top review for each tutor
        const tutorData = await Promise.all(tutors.map(async (t) => {
            const topReview = await Review.findOne({ teacher: t._id })
                .populate('reviewer', 'firstName lastName college')
                .sort({ rating: -1, createdAt: -1 });

            const json = t.toJSON();
            if (topReview) {
                json.topReview = {
                    text: topReview.text,
                    rating: topReview.rating,
                    reviewer: topReview.reviewer
                        ? `${topReview.reviewer.firstName} ${topReview.reviewer.lastName}`
                        : 'Anonymous',
                    college: topReview.reviewer?.college || '',
                };
            }
            return json;
        }));

        res.json(tutorData);
    } catch (error) {
        next(error);
    }
};

// GET /api/tutors/recommended
export const getRecommended = async (req, res, next) => {
    try {
        const user = req.user;

        // Fetch all teachers except the current user
        let filter = { role: 'teacher', _id: { $ne: user._id } };
        const allTutors = await User.find(filter).select('-settings');

        // Smart scoring system
        const scoredTutors = allTutors.map(tutor => {
            let score = 0;
            const tutorJson = tutor.toJSON();

            // Subject match score (40% weight) — how many student subjects does this teacher cover?
            if (user.subjects && user.subjects.length > 0) {
                const matchedSubjects = tutor.subjects.filter(s => user.subjects.includes(s));
                const matchRatio = matchedSubjects.length / user.subjects.length;
                score += matchRatio * 40;
                tutorJson.matchedSubjects = matchedSubjects;
                tutorJson.subjectMatchPercent = Math.round(matchRatio * 100);
            }

            // Rating score (25% weight) — normalized to 0-25
            const ratingScore = (tutor.rating || 0) / 5 * 25;
            score += ratingScore;

            // Response time score (20% weight)
            const responseTimeMap = {
                'Under 1 hour': 20,
                'Under 2 hours': 16,
                'Under 4 hours': 12,
                'Under 12 hours': 8,
                'Within 24 hours': 4,
            };
            score += responseTimeMap[tutor.responseTime] || 5;

            // Sessions/experience score (15% weight) — capped at 50 sessions
            const sessionScore = Math.min((tutor.totalSessions || 0) / 50, 1) * 15;
            score += sessionScore;

            // Online bonus (+5)
            if (tutor.isOnline) score += 5;

            // Verified bonus (+3)
            if (tutor.isVerified) score += 3;

            tutorJson.recommendationScore = Math.round(score);

            // Generate "Why Recommended" reason
            const reasons = [];
            if (tutorJson.subjectMatchPercent >= 50) {
                reasons.push(`Teaches ${tutorJson.matchedSubjects?.length || 0} of your subjects`);
            }
            if (tutor.rating >= 4.5) reasons.push(`⭐ ${tutor.rating} rating`);
            if (tutor.responseTime) reasons.push(`Responds ${tutor.responseTime.toLowerCase()}`);
            if (tutor.studentsHelped >= 10) reasons.push(`${tutor.studentsHelped} students helped`);
            if (tutor.isOnline) reasons.push('🟢 Online now');
            if (tutor.isVerified) reasons.push('✅ Verified');

            tutorJson.whyRecommended = reasons.slice(0, 3);
            return { ...tutorJson, _score: score };
        });

        // Sort by score descending, return top 8
        scoredTutors.sort((a, b) => b._score - a._score);
        const top = scoredTutors.slice(0, 8);

        // Attach top review for each recommended tutor
        const result = await Promise.all(top.map(async (tutor) => {
            const topReview = await Review.findOne({ teacher: tutor.id })
                .populate('reviewer', 'firstName lastName college')
                .sort({ rating: -1, createdAt: -1 });

            if (topReview) {
                tutor.topReview = {
                    text: topReview.text,
                    rating: topReview.rating,
                    reviewer: topReview.reviewer
                        ? `${topReview.reviewer.firstName} ${topReview.reviewer.lastName}`
                        : 'Anonymous',
                };
            }

            delete tutor._score;
            return tutor;
        }));

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// GET /api/tutors/search?q=...  (live search endpoint)
export const searchTutors = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) {
            return res.json([]);
        }

        const regex = new RegExp(q, 'i');
        const tutors = await User.find({
            role: 'teacher',
            $or: [
                { firstName: regex },
                { lastName: regex },
                { subjects: regex },
                { college: regex },
                { department: regex },
                { bio: regex },
            ],
        })
            .sort({ rating: -1, totalSessions: -1 })
            .limit(6)
            .select('firstName lastName college subjects rating totalSessions isOnline isVerified avatar responseTime bio');

        // Attach top review snippet
        const results = await Promise.all(tutors.map(async (t) => {
            const json = t.toJSON();
            const topReview = await Review.findOne({ teacher: t._id })
                .sort({ rating: -1 })
                .select('text rating');
            if (topReview) {
                json.topReview = {
                    text: topReview.text?.substring(0, 80),
                    rating: topReview.rating,
                };
            }
            return json;
        }));

        res.json(results);
    } catch (error) {
        next(error);
    }
};

// GET /api/tutors/:id
export const getTutorById = async (req, res, next) => {
    try {
        const tutor = await User.findById(req.params.id).select('-settings');
        if (!tutor || tutor.role !== 'teacher') {
            return res.status(404).json({ message: 'Tutor not found.' });
        }

        // Fetch reviews for this tutor
        const reviews = await Review.find({ teacher: tutor._id })
            .populate('reviewer', 'firstName lastName college avatar')
            .sort({ createdAt: -1 });

        const tutorData = tutor.toJSON();
        tutorData.reviews = reviews.map(r => {
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

        res.json(tutorData);
    } catch (error) {
        next(error);
    }
};
