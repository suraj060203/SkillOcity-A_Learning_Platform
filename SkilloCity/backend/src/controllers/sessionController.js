import Session from '../models/Session.js';

// GET /api/sessions
export const getSessions = async (req, res, next) => {
    try {
        const { status } = req.query;
        const userId = req.user._id;

        let filter = {
            $or: [{ student: userId }, { teacher: userId }],
        };
        if (status) filter.status = status;

        const sessions = await Session.find(filter)
            .populate('student', 'firstName lastName avatar')
            .populate('teacher', 'firstName lastName avatar')
            .sort({ startTime: -1 });

        const result = sessions.map(s => {
            const sJson = s.toJSON();
            if (s.student) {
                sJson.student = { id: s.student._id, name: `${s.student.firstName} ${s.student.lastName}`, avatar: s.student.avatar };
            }
            if (s.teacher) {
                sJson.teacher = { id: s.teacher._id, name: `${s.teacher.firstName} ${s.teacher.lastName}`, avatar: s.teacher.avatar };
            }
            return sJson;
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// GET /api/sessions/:id
export const getSessionById = async (req, res, next) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('student', 'firstName lastName avatar')
            .populate('teacher', 'firstName lastName avatar');

        if (!session) return res.status(404).json({ message: 'Session not found.' });

        // Ownership check: only the student or teacher of this session can view it
        const userId = req.user._id.toString();
        if (session.student?._id.toString() !== userId && session.teacher?._id.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied. You are not part of this session.' });
        }

        const sJson = session.toJSON();
        if (session.student) {
            sJson.student = { id: session.student._id, name: `${session.student.firstName} ${session.student.lastName}`, avatar: session.student.avatar };
        }
        if (session.teacher) {
            sJson.teacher = { id: session.teacher._id, name: `${session.teacher.firstName} ${session.teacher.lastName}`, avatar: session.teacher.avatar };
        }

        res.json(sJson);
    } catch (error) {
        next(error);
    }
};

// PUT /api/sessions/:id/cancel
export const cancelSession = async (req, res, next) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session not found.' });

        // Ownership check: only the student or teacher of this session can cancel it
        const userId = req.user._id.toString();
        if (session.student.toString() !== userId && session.teacher.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied. You are not part of this session.' });
        }

        if (session.status === 'completed' || session.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot cancel this session.' });
        }

        session.status = 'cancelled';
        await session.save();

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

// PUT /api/sessions/:id/notes
export const addNotes = async (req, res, next) => {
    try {
        const { notes } = req.body;
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session not found.' });

        // Ownership check: only the student or teacher of this session can add notes
        const userId = req.user._id.toString();
        if (session.student.toString() !== userId && session.teacher.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied. You are not part of this session.' });
        }

        session.notes = notes;
        await session.save();

        res.json({ success: true, notes });
    } catch (error) {
        next(error);
    }
};
