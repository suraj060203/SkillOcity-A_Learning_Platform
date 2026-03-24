import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb+srv://skillocity:SkilloCity123@cluster1.sm4ruqe.mongodb.net/skillocityDB',
    jwtSecret: process.env.JWT_SECRET || 'skillocity-dev-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    }
};
