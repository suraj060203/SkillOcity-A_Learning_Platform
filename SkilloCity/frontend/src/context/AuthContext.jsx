import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = authService.getCurrentUser();
        const savedToken = authService.getToken();
        if (savedUser && savedToken) {
            setUser(savedUser);
            setToken(savedToken);
        }
        setLoading(false);

        const handleStorageChange = (e) => {
            if (e.key === 'skillocity_token' || e.key === 'skillocity_user') {
                const refreshedUser = authService.getCurrentUser();
                const refreshedToken = authService.getToken();
                if (refreshedUser && refreshedToken) {
                    setUser(refreshedUser);
                    setToken(refreshedToken);
                } else {
                    setUser(null);
                    setToken(null);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = async (email, password) => {
        const result = await authService.login(email, password);
        setUser(result.user);
        setToken(result.token);
        return result;
    };

    const signup = async (data) => {
        const result = await authService.signup(data);
        setUser(result.user);
        setToken(result.token);
        return result;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setToken(null);
    };

    const updateUser = (data) => {
        const updated = { ...user, ...data };
        setUser(updated);
        localStorage.setItem('skillocity_user', JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateUser, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuthContext must be used within AuthProvider');
    return context;
}

export default AuthContext;
