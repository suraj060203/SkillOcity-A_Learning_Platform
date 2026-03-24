import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/env.js';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { setupSocket } from './socket/socketHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// ─── Middleware ───
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), config.uploadDir)));

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handling ───
app.use(notFound);
app.use(errorHandler);

// ─── Socket.io Setup ───
setupSocket(io);

// ─── Start Server ───
const start = async () => {
    await connectDB();

    httpServer.listen(config.port, () => {
        console.log(`\n🚀 SkilloCity API running on http://localhost:${config.port}`);
        console.log(`📡 Socket.io ready`);
        console.log(`🔗 CORS: ${config.corsOrigin}`);
        console.log(`📁 Uploads: ${path.join(process.cwd(), config.uploadDir)}\n`);
    });
};

start();
