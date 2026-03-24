import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, MessageSquare, Calendar, User, Settings, Inbox, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useUIContext } from '../../context/UIContext';
import { NAV_ITEMS_STUDENT, NAV_ITEMS_TEACHER } from '../../utils/constants';
import Avatar from '../common/Avatar';
import Logo from '../common/Logo';

const iconMap = { Home, Search, MessageSquare, Calendar, User, Settings, Inbox, LogOut, Menu };

export default function Sidebar() {
    const { user, logout } = useAuthContext();
    const { sidebarOpen, toggleSidebar } = useUIContext();
    const navigate = useNavigate();
    const navItems = user?.role === 'teacher' ? NAV_ITEMS_TEACHER : NAV_ITEMS_STUDENT;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile toggle */}
            <button
                className="lg:hidden fixed top-3 left-3 z-[60] bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-md border border-border/40 transition-all hover:shadow-lg"
                onClick={toggleSidebar}
            >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={toggleSidebar} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white z-50 flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                style={{ width: 260, borderRight: '1px solid rgba(229,231,235,0.6)' }}
            >
                {/* Logo + User */}
                <div className="p-5 pb-4">
                    <Logo size="sm" className="mb-5" />
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-primary-light/50 to-transparent">
                        <div className="relative">
                            <Avatar name={user ? `${user.firstName} ${user.lastName}` : 'User'} size={40} />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text truncate">{user?.firstName} {user?.lastName}</p>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${user?.role === 'teacher'
                                ? 'bg-accent/10 text-accent'
                                : 'bg-primary/8 text-primary'
                            }`}>
                                {user?.role === 'teacher' ? '📚 Teacher' : '🎓 Student'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mx-4" />

                {/* Nav */}
                <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = iconMap[item.icon] || Home;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 no-underline group ${isActive
                                        ? 'bg-gradient-primary text-white shadow-sm'
                                        : 'text-muted hover:bg-primary-light/40 hover:text-primary'
                                    }`
                                }
                            >
                                <Icon size={18} className="shrink-0" />
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span className="bg-danger text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse-slow">
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mx-4" />

                {/* Logout */}
                <div className="p-3">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-danger-light hover:text-danger transition-all w-full group"
                    >
                        <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
