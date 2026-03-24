import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import Spinner from '../components/common/Spinner';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Lazy load pages
const LandingPage = lazy(() => import('../pages/public/LandingPage'));
const LoginPage = lazy(() => import('../pages/public/LoginPage'));
const SignupPage = lazy(() => import('../pages/public/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/public/ForgotPasswordPage'));
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const BrowseTutors = lazy(() => import('../pages/student/BrowseTutors'));
const TutorProfile = lazy(() => import('../pages/student/TutorProfile'));
const SendHelpRequest = lazy(() => import('../pages/student/SendHelpRequest'));
const TeacherDashboard = lazy(() => import('../pages/teacher/TeacherDashboard'));
const BrowseRequests = lazy(() => import('../pages/teacher/BrowseRequests'));
const MessagesPage = lazy(() => import('../pages/shared/MessagesPage'));
const MySessionsPage = lazy(() => import('../pages/shared/MySessionsPage'));
const MyProfilePage = lazy(() => import('../pages/shared/MyProfilePage'));
const SettingsPage = lazy(() => import('../pages/shared/SettingsPage'));

const Loading = () => (
    <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
            <Spinner size={48} />
            <p className="mt-4 text-sm text-muted">Loading...</p>
        </div>
    </div>
);

export default function AppRoutes() {
    return (
        <ErrorBoundary>
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />


                {/* Student */}
                <Route path="/dashboard" element={<ProtectedRoute><RoleRoute role="student"><StudentDashboard /></RoleRoute></ProtectedRoute>} />
                <Route path="/browse-tutors" element={<ProtectedRoute><RoleRoute role="student"><BrowseTutors /></RoleRoute></ProtectedRoute>} />
                <Route path="/tutor/:id" element={<ProtectedRoute><TutorProfile /></ProtectedRoute>} />
                <Route path="/send-request" element={<ProtectedRoute><RoleRoute role="student"><SendHelpRequest /></RoleRoute></ProtectedRoute>} />
                <Route path="/send-request/:tutorId" element={<ProtectedRoute><RoleRoute role="student"><SendHelpRequest /></RoleRoute></ProtectedRoute>} />

                {/* Teacher */}
                <Route path="/teacher/dashboard" element={<ProtectedRoute><RoleRoute role="teacher"><TeacherDashboard /></RoleRoute></ProtectedRoute>} />
                <Route path="/help-requests" element={<ProtectedRoute><RoleRoute role="teacher"><BrowseRequests /></RoleRoute></ProtectedRoute>} />

                {/* Shared */}
                <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
                <Route path="/messages/:conversationId" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
                <Route path="/sessions" element={<ProtectedRoute><MySessionsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
        </ErrorBoundary>
    );
}
