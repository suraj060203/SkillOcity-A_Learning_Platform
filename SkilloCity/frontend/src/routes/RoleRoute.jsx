import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function RoleRoute({ role, children }) {
    const { user } = useAuthContext();

    if (user && user.role !== role) {
        return <Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/dashboard'} replace />;
    }
    return children;
}
