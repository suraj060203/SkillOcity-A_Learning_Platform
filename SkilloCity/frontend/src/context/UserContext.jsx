import { createContext, useContext, useState } from 'react';
import { useAuthContext } from './AuthContext';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const { user } = useAuthContext();
    const [profile, setProfile] = useState(user);

    const updateProfile = (data) => {
        setProfile(prev => ({ ...prev, ...data }));
    };

    return (
        <UserContext.Provider value={{ profile: profile || user, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUserContext must be used within UserProvider');
    return context;
}

export default UserContext;
