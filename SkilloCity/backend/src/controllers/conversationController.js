import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// GET /api/conversations
export const getConversations = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId,
        })
            .populate('participants', 'firstName lastName avatar isOnline subjects')
            .sort({ lastMessageTime: -1 });

        const result = await Promise.all(conversations.map(async (conv) => {
            const otherUser = conv.participants.find(p => p._id.toString() !== userId.toString());

            // Count unread messages
            const unreadCount = await Message.countDocuments({
                conversation: conv._id,
                sender: { $ne: userId },
                read: false,
            });

            return {
                id: conv._id,
                with: {
                    id: otherUser?._id,
                    name: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown',
                    avatar: otherUser?.avatar || null,
                    isOnline: otherUser?.isOnline || false,
                    subject: otherUser?.subjects?.[0] || '',
                },
                lastMessage: conv.lastMessage,
                lastMessageTime: conv.lastMessageTime,
                unreadCount,
                urgency: conv.urgency,
            };
        }));

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// GET /api/conversations/:id/messages
export const getMessages = async (req, res, next) => {
    try {
        // Verify the user is a participant of this conversation
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
        if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'Access denied. You are not part of this conversation.' });
        }

        const messages = await Message.find({ conversation: req.params.id })
            .sort({ createdAt: 1 });

        // Mark messages as read
        await Message.updateMany(
            { conversation: req.params.id, sender: { $ne: req.user._id }, read: false },
            { read: true }
        );

        res.json(messages.map(m => m.toJSON()));
    } catch (error) {
        next(error);
    }
};

// POST /api/conversations/:id/messages
export const sendMessage = async (req, res, next) => {
    try {
        const { text, type, meetLink } = req.body;
        const conversationId = req.params.id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
        if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'Access denied. You are not part of this conversation.' });
        }

        const message = new Message({
            conversation: conversationId,
            sender: req.user._id,
            text,
            type: type || 'text',
            meetLink: meetLink || null,
        });
        await message.save();

        // Update conversation's last message
        conversation.lastMessage = text;
        conversation.lastMessageTime = new Date();
        await conversation.save();

        res.status(201).json(message.toJSON());
    } catch (error) {
        next(error);
    }
};

// POST /api/conversations/:id/messages/upload
export const sendFileMessage = async (req, res, next) => {
    try {
        const conversationId = req.params.id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
        if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'Access denied. You are not part of this conversation.' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const fileUrl = req.file.path; // Cloudinary URL
        const fileName = req.file.originalname;

        const message = new Message({
            conversation: conversationId,
            sender: req.user._id,
            text: `📎 ${fileName}`,
            type: 'file',
            fileUrl,
            fileName,
        });
        await message.save();

        conversation.lastMessage = `📎 ${fileName}`;
        conversation.lastMessageTime = new Date();
        await conversation.save();

        res.status(201).json(message.toJSON());
    } catch (error) {
        next(error);
    }
};
