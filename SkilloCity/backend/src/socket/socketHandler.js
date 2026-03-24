import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

const onlineUsers = new Map(); // userId -> socketId

export const setupSocket = (io) => {
    // Auth middleware for Socket.io
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error('Authentication required'));

            const decoded = jwt.verify(token, config.jwtSecret);
            const user = await User.findById(decoded.id).select('-passwordHash');
            if (!user) return next(new Error('User not found'));

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', async (socket) => {
        const userId = socket.user._id.toString();
        console.log(`🔌 User connected: ${socket.user.firstName} (${userId})`);

        // Track online user
        onlineUsers.set(userId, socket.id);
        await User.findByIdAndUpdate(userId, { isOnline: true });

        // Broadcast online status
        socket.broadcast.emit('user:online', { userId });

        // Join user's conversations as rooms
        const conversations = await Conversation.find({ participants: userId });
        conversations.forEach(conv => {
            socket.join(`conv:${conv._id}`);
        });

        // Handle: Send message
        socket.on('message:send', async (data) => {
            try {
                const { conversationId, text, type, meetLink } = data;

                const message = new Message({
                    conversation: conversationId,
                    sender: userId,
                    text,
                    type: type || 'text',
                    meetLink: meetLink || null,
                });
                await message.save();

                // Update conversation
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: text,
                    lastMessageTime: new Date(),
                });

                // Emit to all in conversation room
                io.to(`conv:${conversationId}`).emit('message:receive', {
                    ...message.toJSON(),
                    senderId: userId,
                });
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        // Handle: Mark messages as read
        socket.on('message:read', async ({ conversationId }) => {
            try {
                await Message.updateMany(
                    { conversation: conversationId, sender: { $ne: userId }, read: false },
                    { read: true }
                );
                socket.to(`conv:${conversationId}`).emit('message:read', { conversationId, readBy: userId });
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        // Handle: Typing indicator
        socket.on('typing:start', ({ conversationId }) => {
            socket.to(`conv:${conversationId}`).emit('typing:start', { userId, conversationId });
        });
        socket.on('typing:stop', ({ conversationId }) => {
            socket.to(`conv:${conversationId}`).emit('typing:stop', { userId, conversationId });
        });

        // Handle: Disconnect
        socket.on('disconnect', async () => {
            console.log(`🔌 User disconnected: ${socket.user.firstName} (${userId})`);
            onlineUsers.delete(userId);
            await User.findByIdAndUpdate(userId, { isOnline: false });
            socket.broadcast.emit('user:offline', { userId });
        });
    });
};

export const getOnlineUsers = () => onlineUsers;
