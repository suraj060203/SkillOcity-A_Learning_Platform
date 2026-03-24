export const SUBJECTS = [
    { id: 'physics', name: 'Physics', emoji: '⚛️', color: '#3B82F6' },
    { id: 'chemistry', name: 'Chemistry', emoji: '🧪', color: '#8B5CF6' },
    { id: 'math', name: 'Mathematics', emoji: '📐', color: '#EC4899' },
    { id: 'biology', name: 'Biology', emoji: '🧬', color: '#10B981' },
    { id: 'cs', name: 'Computer Science', emoji: '💻', color: '#3B2FCC' },
    { id: 'react', name: 'React', emoji: '⚛️', color: '#06B6D4' },
    { id: 'javascript', name: 'JavaScript', emoji: '🟨', color: '#F59E0B' },
    { id: 'python', name: 'Python', emoji: '🐍', color: '#3B82F6' },
    { id: 'nodejs', name: 'Node.js', emoji: '🟢', color: '#10B981' },
    { id: 'ml', name: 'Machine Learning', emoji: '🤖', color: '#8B5CF6' },
    { id: 'dsa', name: 'DSA', emoji: '🌳', color: '#EF4444' },
    { id: 'dbms', name: 'DBMS', emoji: '🗄️', color: '#F97316' },
    { id: 'os', name: 'Operating Systems', emoji: '🖥️', color: '#6366F1' },
    { id: 'networks', name: 'Computer Networks', emoji: '🌐', color: '#14B8A6' },
    { id: 'english', name: 'English', emoji: '📖', color: '#F43F5E' },
    { id: 'economics', name: 'Economics', emoji: '📊', color: '#22C55E' },
    { id: 'statistics', name: 'Statistics', emoji: '📈', color: '#A855F7' },
    { id: 'electronics', name: 'Electronics', emoji: '🔌', color: '#0EA5E9' },
    { id: 'mechanical', name: 'Mechanical Eng', emoji: '⚙️', color: '#78716C' },
    { id: 'civil', name: 'Civil Eng', emoji: '🏗️', color: '#D97706' },
];

export const URGENCY_LEVELS = {
    normal: { key: 'normal', label: 'Normal', emoji: '🟢', color: '#10B981', bg: '#D1FAE5', text: 'No rush, flexible timing' },
    urgent: { key: 'urgent', label: 'Urgent', emoji: '🟡', color: '#F59E0B', bg: '#FEF3C7', text: 'Need help in 2–3 days' },
    'exam-soon': { key: 'exam-soon', label: 'Exam Soon', emoji: '🔴', color: '#EF4444', bg: '#FEE2E2', text: 'My exam is very close!' },
};

export const TIME_SLOTS = [
    { id: 'morning', label: 'Morning', time: '8am–12pm', emoji: '🌅' },
    { id: 'afternoon', label: 'Afternoon', time: '12pm–4pm', emoji: '☀️' },
    { id: 'evening', label: 'Evening', time: '4pm–8pm', emoji: '🌆' },
    { id: 'night', label: 'Night', time: '8pm–11pm', emoji: '🌙' },
];

export const DAY_PREFERENCES = [
    { id: 'weekdays', label: 'Weekdays' },
    { id: 'weekends', label: 'Weekends' },
    { id: 'any', label: 'Any Day' },
];

export const YEAR_OPTIONS = [
    '1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'PhD'
];

export const ROLES = {
    student: { key: 'student', label: 'Student', emoji: '🎓', color: '#3B2FCC' },
    teacher: { key: 'teacher', label: 'Teacher', emoji: '📚', color: '#FF6B35' },
};

export const SESSION_STATUS = {
    upcoming: { label: 'Upcoming', color: '#3B2FCC', bg: '#EEF0FF' },
    ongoing: { label: 'Ongoing', color: '#10B981', bg: '#D1FAE5' },
    completed: { label: 'Completed', color: '#6B7280', bg: '#F3F4F6' },
    cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEE2E2' },
};

export const QUICK_REPLIES = [
    "I'm available tomorrow",
    "Session confirmed!",
    "Can we reschedule?",
    "I'll get back to you soon",
];

export const NAV_ITEMS_STUDENT = [
    { path: '/dashboard', label: 'Dashboard', icon: 'Home' },
    { path: '/browse-tutors', label: 'Browse Tutors', icon: 'Search' },
    { path: '/messages', label: 'Messages', icon: 'MessageSquare', badge: 3 },
    { path: '/sessions', label: 'My Sessions', icon: 'Calendar' },
    { path: '/profile', label: 'My Profile', icon: 'User' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
];

export const NAV_ITEMS_TEACHER = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: 'Home' },
    { path: '/help-requests', label: 'Help Requests', icon: 'Inbox', badge: 5 },
    { path: '/sessions', label: 'My Sessions', icon: 'Calendar' },
    { path: '/messages', label: 'Messages', icon: 'MessageSquare', badge: 2 },
    { path: '/profile', label: 'My Profile', icon: 'User' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
];
