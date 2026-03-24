import { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(null);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const openModal = (name) => setModalOpen(name);
    const closeModal = () => setModalOpen(null);

    return (
        <UIContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar, modalOpen, openModal, closeModal }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUIContext() {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUIContext must be used within UIProvider');
    return context;
}

export default UIContext;
