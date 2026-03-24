import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={48} /></div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}
