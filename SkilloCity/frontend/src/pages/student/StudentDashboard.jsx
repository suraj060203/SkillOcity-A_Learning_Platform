import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ArrowRight, Clock, BookOpen, Zap, TrendingUp, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import TutorCard from '../../components/cards/TutorCard';
import Avatar from '../../components/common/Avatar';
import SubjectPill from '../../components/common/SubjectPill';
import StarRating from '../../components/common/StarRating';
import Spinner from '../../components/common/Spinner';
import { useAuthContext } from '../../context/AuthContext';
import { formatRelativeTime, truncateText } from '../../utils/formatters';
import tutorService from '../../services/tutorService';
import sessionService from '../../services/sessionService';
import messageService from '../../services/messageService';
import useDebounce from '../../hooks/useDebounce';
import { format } from 'date-fns';

export default function StudentDashboard() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [recommended, setRecommended] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tutors, sesData, convs] = await Promise.all([
                    tutorService.getRecommended(),
                    sessionService.getAll().catch(() => []),
                    messageService.getConversations().catch(() => []),
                ]);
                setRecommended(tutors);
                setSessions(sesData);
                setConversations(convs);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (debouncedSearch.trim().length < 2) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }
        const doSearch = async () => {
            setSearchLoading(true);
            try {
                const results = await tutorService.search(debouncedSearch);
                setSearchResults(results);
                setShowSearchDropdown(true);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setSearchLoading(false);
            }
        };
        doSearch();
    }, [debouncedSearch]);

    useEffect(() => {
        const handleClick = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSearchDropdown(false);
            navigate(`/browse-tutors?q=${searchQuery}`);
        }
    };

    const today = new Date();
    const dayName = format(today, 'EEEE, MMMM d');
    const upcomingSessions = sessions.filter(s => s.status === 'upcoming' || s.status === 'ongoing').slice(0, 3);
    const completedCount = sessions.filter(s => s.status === 'completed').length;
    const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

    return (
        <PageWrapper>
            <div className="max-w-6xl mx-auto py-8 px-6 lg:px-8">

                {/* ─── METRICS HEADER (Minimalist) ─── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-200 pb-8">
                    <div>
                        <p className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest mb-3">{dayName}</p>
                        <h1 className="text-3xl font-display text-zinc-950 tracking-tight">
                            Welcome back, {user?.firstName}.
                        </h1>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 md:gap-8">
                        <div>
                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Sessions</p>
                            <p className="text-3xl font-mono font-medium text-zinc-950 tracking-tight">{completedCount}</p>
                        </div>
                        <div className="w-[1px] h-12 bg-zinc-200 hidden md:block" />
                        <div>
                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Unread</p>
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-mono font-medium text-zinc-950 tracking-tight">{unreadMessages}</p>
                                {unreadMessages > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── SEARCH ─── */}
                <div className="relative mb-14" ref={searchRef}>
                    <form onSubmit={handleSearchSubmit}>
                        <div className="relative group">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                                placeholder="Search to learn something new today..."
                                className="w-full h-12 pl-12 pr-24 bg-white border border-border rounded-md text-[15px] font-medium text-text placeholder:text-muted focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-colors shadow-sm"
                            />
                            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 h-10 px-4 bg-primary text-white rounded-md text-[13px] font-bold hover:bg-primary-dark transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                Search
                            </button>
                        </div>
                    </form>

                    {showSearchDropdown && (
                        <div className="absolute top-14 left-0 right-0 bg-white border border-zinc-200 rounded-md shadow-lg z-50 overflow-hidden">
                            {searchLoading ? (
                                <div className="p-6 flex flex-col items-center justify-center text-zinc-500">
                                    <span className="w-5 h-5 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mb-3" />
                                    <span className="text-[13px] font-medium">Searching network...</span>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-[13px] font-medium text-zinc-600">No matches found for "{debouncedSearch}"</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-200/60 max-h-[400px] overflow-y-auto">
                                    {searchResults.map((tutor) => (
                                        <button
                                            key={tutor.id}
                                            onClick={() => { setShowSearchDropdown(false); navigate(`/tutor/${tutor.id}`); }}
                                            className="w-full flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors text-left group"
                                        >
                                            <Avatar name={tutor.name} size={40} online={tutor.isOnline} className="border border-zinc-200" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-sm font-bold text-zinc-900 truncate group-hover:text-zinc-600 transition-colors">{tutor.name}</span>
                                                    {tutor.isVerified && <span className="text-zinc-900 text-[10px] w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">✓</span>}
                                                </div>
                                                <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider truncate mb-1">{tutor.college}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {(tutor.subjects || []).slice(0, 3).map(s => (
                                                        <span key={s} className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-medium rounded border border-zinc-200">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <div className="flex items-center gap-1 justify-end mb-1">
                                                    <StarRating rating={tutor.rating} size={10} />
                                                    <span className="text-[11px] font-bold text-zinc-900">{tutor.rating}</span>
                                                </div>
                                                <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors ml-auto" />
                                            </div>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => { setShowSearchDropdown(false); navigate(`/browse-tutors?q=${searchQuery}`); }}
                                        className="w-full p-3 bg-zinc-50 text-center text-[12px] font-bold text-zinc-900 hover:bg-zinc-100 transition-colors"
                                    >
                                        View all results
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ─── RECOMMENDED ─── */}
                <section className="mb-14">
                    <div className="flex items-end justify-between mb-6">
                        <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" /> Top Matches
                        </h2>
                        <button onClick={() => navigate('/browse-tutors')} className="text-[12px] font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-widest transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">
                            Browse Network →
                        </button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="rounded-md border border-zinc-200 bg-white p-5 animate-pulse">
                                    <div className="flex gap-4 mb-4"><div className="w-12 h-12 rounded-full bg-zinc-200" /><div className="flex-1 space-y-2"><div className="h-4 bg-zinc-200 w-3/4 rounded" /><div className="h-3 bg-zinc-200 w-1/2 rounded" /></div></div>
                                    <div className="h-20 bg-zinc-100 rounded mb-4" />
                                    <div className="h-9 bg-zinc-200 w-full rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {recommended.slice(0, 4).map((t) => (
                                <div key={t.id} className="animate-fade-up">
                                    <TutorCard tutor={t} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ─── DATA SPLIT: SESSIONS & INBOX ─── */}
                <div className="grid lg:grid-cols-2 gap-8 mb-14">
                    
                    {/* Sessions */}
                    <section>
                        <div className="flex items-end justify-between mb-6 border-b border-zinc-200 pb-3">
                            <h2 className="text-lg font-bold text-zinc-950">Upcoming Bookings</h2>
                            <button onClick={() => navigate('/sessions')} className="text-[12px] font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-widest transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">
                                View Log →
                            </button>
                        </div>
                        
                        {upcomingSessions.length === 0 ? (
                            <div className="border border-dashed border-zinc-300 rounded-md p-8 text-center bg-zinc-50/50">
                                <p className="text-[13px] font-medium text-zinc-500 mb-4">Your schedule is completely clear.</p>
                                <button onClick={() => navigate('/browse-tutors')} className="h-9 px-4 bg-white border border-zinc-200 text-zinc-900 text-[12px] font-bold rounded-md hover:bg-zinc-50 transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 inline-flex items-center gap-2">
                                    Book a Session
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingSessions.map((session) => (
                                    <div key={session.id} className="flex items-center justify-between p-4 border border-zinc-200 rounded-md bg-white hover:border-zinc-300 transition-colors group">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                                                <Calendar size={18} className="text-zinc-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-[14px] font-bold text-zinc-900 truncate">{session.topic || session.subject}</h3>
                                                <p className="text-[12px] font-medium text-zinc-500 truncate">
                                                    with {session.teacher?.name || 'Tutor'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {session.meetLink ? (
                                             <button onClick={() => window.open(session.meetLink, '_blank')} className="shrink-0 h-8 px-3 ml-4 bg-primary text-white text-[11px] font-bold uppercase tracking-wider rounded border border-transparent hover:bg-primary-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                                 Join Room
                                             </button>
                                        ) : (
                                            <span className="shrink-0 ml-4 px-2 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded border border-zinc-200">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Messages */}
                    <section>
                        <div className="flex items-end justify-between mb-6 border-b border-zinc-200 pb-3">
                            <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
                                Inbox {unreadMessages > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                            </h2>
                            <button onClick={() => navigate('/messages')} className="text-[12px] font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-widest transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">
                                Open Chat →
                            </button>
                        </div>
                        
                        {conversations.length === 0 ? (
                            <div className="border border-dashed border-zinc-300 rounded-md p-8 text-center bg-zinc-50/50 h-[126px] flex flex-col items-center justify-center">
                                <p className="text-[13px] font-medium text-zinc-500">Inbox zero.</p>
                            </div>
                        ) : (
                            <div className="border border-zinc-200 rounded-md bg-white divide-y divide-zinc-200/60">
                                {conversations.slice(0, 4).map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => navigate(`/messages/${conv.id}`)}
                                        className="w-full flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors text-left"
                                    >
                                        <Avatar name={conv.with?.name} size={40} online={conv.with?.isOnline} className="shrink-0 border border-zinc-200" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className={`text-[14px] font-bold truncate ${conv.unreadCount > 0 ? 'text-zinc-950' : 'text-zinc-700'}`}>
                                                    {conv.with?.name}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest shrink-0 ml-2">
                                                    {formatRelativeTime(conv.lastMessageTime)}
                                                </span>
                                            </div>
                                            <p className={`text-[13px] truncate ${conv.unreadCount > 0 ? 'font-bold text-zinc-900' : 'font-medium text-zinc-500'}`}>
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </PageWrapper>
    );
}
