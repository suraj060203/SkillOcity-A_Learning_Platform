import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo';

export default function Navbar({ transparent = false }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isLanding = location.pathname === '/';
    // Use minimal solid white nav constantly, except purely at the very top of landing if requested
    const isTransparent = transparent && !scrolled && isLanding;
    const navBg = isTransparent
        ? 'bg-transparent'
        : 'bg-white/90 backdrop-blur-md border-b border-border/60 transition-colors duration-300';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 ${navBg}`} style={{ height: 64 }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
                <Link to="/" className="flex items-center no-underline outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">
                    <Logo light={false} />
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    {isLanding && (
                        <div className="flex items-center gap-8">
                            <a href="#how-it-works" className="text-[13px] font-medium text-muted hover:text-zinc-900 transition-colors no-underline outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">How it Works</a>
                            <a href="#subjects" className="text-[13px] font-medium text-muted hover:text-zinc-900 transition-colors no-underline outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">Subjects</a>
                            <a href="#reviews" className="text-[13px] font-medium text-muted hover:text-zinc-900 transition-colors no-underline outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">Reviews</a>
                        </div>
                    )}
                    <div className="flex items-center gap-4 border-l border-border/60 pl-8">
                        <button 
                            onClick={() => navigate('/login')} 
                            className="text-[13px] font-medium text-muted hover:text-zinc-900 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm"
                        >
                            Log in
                        </button>
                        <button 
                            onClick={() => navigate('/signup')} 
                            className="h-8 px-4 bg-primary text-white rounded-md text-[13px] font-bold hover:bg-primary-dark transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Mobile hamburger */}
                <button 
                    className="md:hidden p-2 -mr-2 text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-md" 
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden absolute top-[64px] left-0 right-0 bg-white border-b border-border shadow-lg px-6 py-6 space-y-6 flex flex-col">
                    {isLanding && (
                        <div className="flex flex-col gap-4 border-b border-border/60 pb-6">
                            <a href="#how-it-works" className="text-sm font-medium text-zinc-600 no-underline" onClick={() => setMobileOpen(false)}>How it Works</a>
                            <a href="#subjects" className="text-sm font-medium text-zinc-600 no-underline" onClick={() => setMobileOpen(false)}>Subjects</a>
                            <a href="#reviews" className="text-sm font-medium text-zinc-600 no-underline" onClick={() => setMobileOpen(false)}>Reviews</a>
                        </div>
                    )}
                    <div className="flex flex-col gap-3">
                        <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="w-full h-10 border border-border rounded-md text-sm font-medium text-text bg-white shadow-sm">Log in</button>
                        <button onClick={() => { navigate('/signup'); setMobileOpen(false); }} className="w-full h-10 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-bold shadow-sm transition-colors">Sign Up</button>
                    </div>
                </div>
            )}
        </nav>
    );
}
