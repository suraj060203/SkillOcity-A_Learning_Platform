import HelpRequest from '../models/HelpRequest.js';
import Session from '../models/Session.js';
import Conversation from '../models/Conversation.js';

// GET /api/requests
export const getRequests = async (req, res, next) => {
    try {
        const { subject, urgency, sortBy } = req.query;
        let filter = { status: 'pending' };

        // Teachers only see requests targeted at them OR open requests (no target)
        if (req.user.role === 'teacher') {
            filter.$or = [
                { targetTutor: req.user._id },
                { targetTutor: null },
            ];
        } else {
            // Students see only their own requests
            filter.student = req.user._id;
        }

        if (subject) filter.subject = subject;
        if (urgency) filter.urgency = urgency;

        let sort = { createdAt: -1 }; // newest first
        if (sortBy === 'urgent') {
            sort = { urgency: -1, createdAt: -1 };
        }

        const requests = await HelpRequest.find(filter)
            .populate('student', 'firstName lastName college avatar')
            .sort(sort);

        const result = requests.map(r => {
            const rJson = r.toJSON();
            if (r.student) {
                rJson.student = {
                    id: r.student._id,
                    name: `${r.student.firstName} ${r.student.lastName}`,
                    college: r.student.college,
                    avatar: r.student.avatar,
                };
            }
            return rJson;
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// POST /api/requests
export const createRequest = async (req, res, next) => {
    try {
        const { subject, topic, description, urgency, examDate, preferredTime, dayPreference, targetTutor } = req.body;

        const request = new HelpRequest({
            student: req.user._id,
            targetTutor: targetTutor || null,
            subject,
            topic,
            description: description || topic,
            urgency: urgency || 'normal',
            examDate: examDate || null,
            preferredTime: preferredTime || [],
            dayPreference: dayPreference || 'any',
        });

        // Handle attachment if uploaded (Cloudinary stores URL in req.file.path)
        if (req.file) {
            request.attachment = req.file.path;
        }

        await request.save();
        res.status(201).json(request.toJSON());
    } catch (error) {
        next(error);
    }
};

// PUT /api/requests/:id/accept
export const acceptRequest = async (req, res, next) => {
    try {
        const request = await HelpRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found.' });
        if (request.status !== 'pending') return res.status(400).json({ message: 'Request is no longer pending.' });

        request.status = 'accepted';
        request.acceptedBy = req.user._id;
        await request.save();

        // Create a session
        const startTime = new Date();
        startTime.setDate(startTime.getDate() + 1);
        startTime.setHours(17, 0, 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(18, 0, 0, 0);

        const session = new Session({
            student: request.student,
            teacher: req.user._id,
            helpRequest: request._id,
            subject: request.subject,
            topic: request.topic,
            startTime,
            endTime,
            meetLink: `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`,
        });
        await session.save();

        // Create or find conversation between student and teacher
        let conversation = await Conversation.findOne({
            participants: { $all: [request.student, req.user._id] },
        });
        if (!conversation) {
            conversation = new Conversation({
                participants: [request.student, req.user._id],
                lastMessage: 'Request accepted! Let\'s schedule a session.',
                lastMessageTime: new Date(),
            });
            await conversation.save();
        }

        res.json({ success: true, session: session.toJSON() });
    } catch (error) {
        next(error);
    }
};

// PUT /api/requests/:id/decline
export const declineRequest = async (req, res, next) => {
    try {
        const request = await HelpRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found.' });
        if (request.status !== 'pending') return res.status(400).json({ message: 'Request is no longer pending.' });

        request.status = 'declined';
        await request.save();

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};
