import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext';
import { UIProvider } from './context/UIContext';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <UserProvider>
                    <SocketProvider>
                        <UIProvider>
                            <AppRoutes />
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    duration: 3000,
                                    style: { borderRadius: '10px', background: '#1A1A2E', color: '#fff', fontSize: '14px' },
                                    success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
                                    error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
                                }}
                            />
                        </UIProvider>
                    </SocketProvider>
                </UserProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
