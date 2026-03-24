import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import config from '../config/env.js';

// Configure Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar') {
        // Only images for avatars
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for avatars'), false);
        }
    } else {
        // Allow common file types for attachments
        const allowed = ['image/', 'application/pdf', 'text/', 'application/msword',
            'application/vnd.openxmlformats-officedocument'];
        if (allowed.some(type => file.mimetype.startsWith(type))) {
            cb(null, true);
        } else {
            cb(new Error('File type not supported'), false);
        }
    }
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'skillocity_attachments';
        if (file.fieldname === 'avatar') {
            folder = 'skillocity_avatars';
        }
        return {
            folder: folder,
            resource_type: "auto", // Allow images, pdfs, docs, etc.
        };
    },
});

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
