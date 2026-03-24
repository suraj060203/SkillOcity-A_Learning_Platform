/**
 * Database seed script — populates MongoDB with the same mock data
 * that the frontend uses, so you can test the full stack immediately.
 *
 * Usage: cd backend && npm run seed
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/env.js';
import User from '../models/User.js';
import HelpRequest from '../models/HelpRequest.js';
import Session from '../models/Session.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Review from '../models/Review.js';

const seed = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            HelpRequest.deleteMany({}),
            Session.deleteMany({}),
            Conversation.deleteMany({}),
            Message.deleteMany({}),
            Review.deleteMany({}),
        ]);
        console.log('🗑️  Cleared existing data');

        const rawPassword = 'SkilloCity@2026';

        // ─── Create Users ───
        const priya = await User.create({
            firstName: 'Priya', lastName: 'Mehta', email: 'priya@bits.ac.in',
            passwordHash: rawPassword, role: 'student', college: 'BITS Pilani', year: '3rd Year',
            department: 'Computer Science',
            bio: 'Passionate about learning new technologies and building cool projects.',
            subjects: ['react', 'javascript', 'python'],
            isOnline: true,
        });

        const raj = await User.create({
            firstName: 'Raj', lastName: 'Sharma', email: 'raj@iiith.ac.in',
            passwordHash: rawPassword, role: 'teacher', college: 'IIIT Hyderabad', year: '3rd Year',
            department: 'Computer Science',
            bio: 'Full-stack developer with 3+ years of experience in React and Node.js.',
            subjects: ['react', 'javascript', 'python', 'nodejs'],
            teachingSubjects: ['react', 'javascript', 'python', 'nodejs'],
            rating: 4.9, totalSessions: 52, studentsHelped: 47, responseTime: '< 2 hours',
            isVerified: true, isOnline: true,
            availability: {
                Mon: ['morning', 'evening'], Tue: ['afternoon', 'evening'],
                Wed: ['morning', 'afternoon'], Thu: ['evening', 'night'],
                Fri: ['morning', 'afternoon', 'evening'], Sat: ['morning', 'afternoon'],
                Sun: ['evening'],
            },
        });

        const sneha = await User.create({
            firstName: 'Sneha', lastName: 'Patel', email: 'sneha@iitb.ac.in',
            passwordHash: rawPassword, role: 'teacher', college: 'IIT Bombay', year: '4th Year',
            department: 'Physics',
            bio: 'Physics enthusiast specializing in Thermodynamics and Quantum Mechanics.',
            subjects: ['physics', 'math', 'chemistry'],
            teachingSubjects: ['physics', 'math', 'chemistry'],
            rating: 4.8, totalSessions: 38, studentsHelped: 32, responseTime: '< 1 hour',
            isVerified: true, isOnline: true,
        });

        const arjun = await User.create({
            firstName: 'Arjun', lastName: 'Kumar', email: 'arjun@nitt.ac.in',
            passwordHash: rawPassword, role: 'teacher', college: 'NIT Trichy', year: '2nd Year',
            department: 'Computer Science',
            bio: 'Competitive programmer ranked in top 500 on CodeChef.',
            subjects: ['dsa', 'python', 'cs'],
            teachingSubjects: ['dsa', 'python', 'cs'],
            rating: 4.7, totalSessions: 29, studentsHelped: 25, responseTime: '< 3 hours',
            isVerified: true, isOnline: false,
        });

        const meera = await User.create({
            firstName: 'Meera', lastName: 'Joshi', email: 'meera@du.ac.in',
            passwordHash: rawPassword, role: 'teacher', college: 'Delhi University', year: '3rd Year',
            department: 'Mathematics',
            bio: 'Mathematics major with a passion for Statistics and Probability.',
            subjects: ['math', 'statistics', 'economics'],
            teachingSubjects: ['math', 'statistics', 'economics'],
            rating: 4.6, totalSessions: 22, studentsHelped: 19, responseTime: '< 4 hours',
            isVerified: false, isOnline: true,
        });

        const vikram = await User.create({
            firstName: 'Vikram', lastName: 'Singh', email: 'vikram@vit.ac.in',
            passwordHash: rawPassword, role: 'teacher', college: 'VIT Vellore', year: '4th Year',
            department: 'Computer Science',
            bio: 'ML/AI researcher with published papers.',
            subjects: ['ml', 'python', 'statistics', 'math'],
            teachingSubjects: ['ml', 'python', 'statistics', 'math'],
            rating: 4.9, totalSessions: 45, studentsHelped: 40, responseTime: '< 2 hours',
            isVerified: true, isOnline: false,
        });

        const aisha = await User.create({
            firstName: 'Aisha', lastName: 'Khan', email: 'aisha@bits-goa.ac.in',
            passwordHash: rawPassword, role: 'teacher', college: 'BITS Goa', year: '3rd Year',
            department: 'Electronics',
            bio: 'Electronics and embedded systems enthusiast.',
            subjects: ['electronics', 'physics', 'math'],
            teachingSubjects: ['electronics', 'physics', 'math'],
            rating: 4.5, totalSessions: 15, studentsHelped: 12, responseTime: '< 5 hours',
            isVerified: true, isOnline: true,
        });

        // Additional students for help requests
        const ananya = await User.create({
            firstName: 'Ananya', lastName: 'Sharma', email: 'ananya@du.ac.in',
            passwordHash: rawPassword, role: 'student', college: 'Delhi University', year: '2nd Year',
            department: 'Physics', subjects: ['physics'], isOnline: false,
        });

        const karthik = await User.create({
            firstName: 'Karthik', lastName: 'Reddy', email: 'karthik@bits.ac.in',
            passwordHash: rawPassword, role: 'student', college: 'BITS Pilani', year: '3rd Year',
            department: 'Computer Science', subjects: ['react', 'javascript'], isOnline: true,
        });

        const neha = await User.create({
            firstName: 'Neha', lastName: 'Gupta', email: 'neha@iitd.ac.in',
            passwordHash: rawPassword, role: 'student', college: 'IIT Delhi', year: '2nd Year',
            department: 'Computer Science', subjects: ['dsa'], isOnline: false,
        });

        console.log('👤 Created 10 users');

        // ─── Create Help Requests ───
        await HelpRequest.insertMany([
            { student: ananya._id, subject: 'physics', topic: 'Thermodynamics — Second Law & Entropy', description: 'I have my mid-semester exam in 3 days.', urgency: 'exam-soon', examDate: new Date('2026-03-22'), preferredTime: ['evening'], dayPreference: 'weekdays' },
            { student: karthik._id, subject: 'react', topic: 'React Hooks & State Management', description: 'Want to understand useEffect, useCallback, useMemo.', urgency: 'urgent', preferredTime: ['afternoon', 'evening'], dayPreference: 'any' },
            { student: neha._id, subject: 'dsa', topic: 'Dynamic Programming Patterns', description: 'Struggle with optimization problems.', urgency: 'normal', preferredTime: ['morning', 'afternoon'], dayPreference: 'weekends' },
            { student: priya._id, subject: 'python', topic: 'Python OOP Concepts', description: 'Need help with classes and inheritance.', urgency: 'normal', preferredTime: ['evening', 'night'], dayPreference: 'any' },
            { student: ananya._id, subject: 'ml', topic: 'Neural Networks from Scratch', description: 'Want to understand backpropagation.', urgency: 'exam-soon', examDate: new Date('2026-03-25'), preferredTime: ['morning'], dayPreference: 'weekdays' },
        ]);
        console.log('📋 Created 5 help requests');

        // ─── Create Sessions ───
        const now = new Date();
        await Session.insertMany([
            { student: priya._id, teacher: sneha._id, subject: 'physics', topic: 'Thermodynamics Chapter 6', startTime: new Date(now.getTime() + 86400000), endTime: new Date(now.getTime() + 86400000 + 3600000), status: 'upcoming', meetLink: 'https://meet.google.com/abc-defg-hij' },
            { student: priya._id, teacher: raj._id, subject: 'react', topic: 'Building Custom Hooks', startTime: new Date(now.getTime() + 172800000), endTime: new Date(now.getTime() + 172800000 + 3600000), status: 'upcoming', meetLink: 'https://meet.google.com/xyz-uvwx-abc' },
            { student: priya._id, teacher: arjun._id, subject: 'dsa', topic: 'Binary Trees & BST', startTime: new Date(now.getTime() - 3600000), endTime: new Date(now.getTime()), status: 'ongoing', meetLink: 'https://meet.google.com/meet-live-123' },
            { student: priya._id, teacher: raj._id, subject: 'javascript', topic: 'Closures & Prototypes', startTime: new Date(now.getTime() - 4 * 86400000), endTime: new Date(now.getTime() - 4 * 86400000 + 5400000), status: 'completed', notes: 'Great session! Covered closures in depth.', reviewed: true },
            { student: priya._id, teacher: vikram._id, subject: 'python', topic: 'Data Structures in Python', startTime: new Date(now.getTime() - 7 * 86400000), endTime: new Date(now.getTime() - 7 * 86400000 + 3600000), status: 'completed' },
        ]);
        console.log('📚 Created 5 sessions');

        // ─── Create Conversations & Messages ───
        const conv1 = await Conversation.create({
            participants: [priya._id, raj._id],
            lastMessage: 'Study Room Ready 🎥',
            lastMessageTime: new Date(),
        });
        await Message.insertMany([
            { conversation: conv1._id, sender: raj._id, text: 'Hi Priya! I saw your request for React hooks help.', read: true },
            { conversation: conv1._id, sender: priya._id, text: "Yes! I'm struggling with useEffect cleanup functions.", read: true },
            { conversation: conv1._id, sender: raj._id, text: "No worries, let me set up a session for us.", read: true },
            { conversation: conv1._id, sender: raj._id, text: 'How about tomorrow at 5 PM?', read: true },
            { conversation: conv1._id, sender: priya._id, text: 'That works perfectly! Thank you so much 🙏', read: true },
            { conversation: conv1._id, sender: raj._id, text: 'Study Room Ready 🎥', type: 'meet-link', meetLink: 'https://meet.google.com/abc-defg-hij', read: false },
        ]);

        const conv2 = await Conversation.create({
            participants: [priya._id, sneha._id],
            lastMessage: "Don't worry, we have enough time...",
            lastMessageTime: new Date(),
            urgency: 'urgent',
        });
        await Message.insertMany([
            { conversation: conv2._id, sender: priya._id, text: 'Hi Sneha, I need urgent help with Thermodynamics!', read: true },
            { conversation: conv2._id, sender: sneha._id, text: 'Sure! When is your exam?', read: true },
            { conversation: conv2._id, sender: priya._id, text: "It's on March 22nd 😰", read: true },
            { conversation: conv2._id, sender: sneha._id, text: "Don't worry, we have enough time. Let's schedule sessions for the next 2 days.", read: false },
        ]);

        const conv3 = await Conversation.create({
            participants: [priya._id, arjun._id],
            lastMessage: 'Great, see you then!',
            lastMessageTime: new Date(),
        });
        await Message.insertMany([
            { conversation: conv3._id, sender: arjun._id, text: 'Your session is confirmed for today at 2 PM!', read: true },
            { conversation: conv3._id, sender: priya._id, text: 'Great, see you then!', read: true },
        ]);
        console.log('💬 Created 3 conversations with messages');

        // ─── Create Reviews ───
        await Review.insertMany([
            { reviewer: priya._id, teacher: raj._id, rating: 5, text: 'Raj is an amazing teacher! He explained React hooks so clearly.', subject: 'React' },
            { reviewer: ananya._id, teacher: raj._id, rating: 5, text: 'Extremely patient and knowledgeable. Helped me understand closures.', subject: 'JavaScript' },
            { reviewer: karthik._id, teacher: raj._id, rating: 4, text: 'Good session on Node.js basics. Covered Express routing.', subject: 'Node.js' },
            { reviewer: neha._id, teacher: vikram._id, rating: 5, text: 'Best Python teacher on the platform!', subject: 'Python' },
        ]);
        console.log('⭐ Created 4 reviews');

        console.log('\n🎉 Database seeded successfully!');
        console.log('📧 Login credentials for all users: SkilloCity@2026');
        console.log('   Student: priya@bits.ac.in');
        console.log('   Teacher: raj@iiith.ac.in');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seed();
