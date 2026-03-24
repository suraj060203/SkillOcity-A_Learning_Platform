import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Video, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import SessionCard from '../../components/cards/SessionCard';
import Spinner from '../../components/common/Spinner';
import sessionService from '../../services/sessionService';
import { useAuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function MySessionsPage() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await sessionService.getAll();
                setSessions(data);
            } catch (err) {
                console.error('Error fetching sessions:', err);
                toast.error('Failed to load sessions');
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const upcoming = sessions.filter(s => s.status === 'upcoming');
    const ongoing = sessions.filter(s => s.status === 'ongoing');
    const past = sessions.filter(s => s.status === 'completed');

    const tabs = [
        { id: 'upcoming', label: 'Upcoming', icon: <Calendar size={16}/>, count: upcoming.length, color: 'text-primary', bg: 'bg-primary' },
        { id: 'ongoing', label: 'Live Now', icon: <Video size={16}/>, count: ongoing.length, color: 'text-success', bg: 'bg-success' },
        { id: 'past', label: 'Completed', icon: <CheckCircle size={16}/>, count: past.length, color: 'text-muted', bg: 'bg-gray-400' },
    ];

    const displayed = activeTab === 'upcoming' ? upcoming : activeTab === 'ongoing' ? ongoing : past;

    const handleCancel = async (id) => {
        try {
            await sessionService.cancel(id);
            setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
            toast.success('Session cancelled');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel');
        }
    };
    const handleReview = () => toast('Review form coming soon!', { icon: '⭐' });
    const handleNotes = () => toast('Notes feature coming soon!', { icon: '📝' });

    return (
        <PageWrapper>
            <div className="max-w-5xl mx-auto page-enter py-4 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-display text-text mb-2">My Sessions</h1>
                        <p className="text-sm text-muted">Manage your upcoming schedule and review past sessions.</p>
                    </div>
                    {user?.role === 'student' && (
                        <button 
                            onClick={() => navigate('/browse-tutors')}
                            className="h-11 px-6 bg-gradient-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
                        >
                            <Search size={16} /> Find a Tutor
                        </button>
                    )}
                </div>

                {/* ── Tabs ── */}
                <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 p-1.5 bg-white/70 backdrop-blur-md border border-black/[0.04] rounded-2xl shadow-sm ring-1 ring-white/50">
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 relative ${isActive ? 'bg-white text-text shadow-sm border border-black/5' : 'text-muted hover:bg-white/50 hover:text-text border border-transparent'}`}
                            >
                                <span className={`${isActive ? tab.color : 'text-muted'}`}>{tab.icon}</span>
                                {tab.label}
                                <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${isActive ? `${tab.bg} text-white` : 'bg-zinc-100 text-muted'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Content ── */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card-premium p-6">
                                <div className="flex gap-4"><div className="skeleton w-12 h-12 rounded-full" /><div className="flex-1 space-y-2.5 pt-1"><div className="skeleton h-4 w-1/3" /><div className="skeleton h-3 w-1/4" /></div></div>
                            </div>
                        ))}
                    </div>
                ) : displayed.length === 0 ? (
                    <div className="card-premium py-20 text-center border-2 border-dashed border-border/60 bg-gray-50/30">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-border/40 text-muted">
                            {activeTab === 'upcoming' ? <Calendar size={32} /> : activeTab === 'ongoing' ? <Video size={32} /> : <CheckCircle size={32} />}
                        </div>
                        <h3 className="text-xl font-bold text-text mb-2">
                            No {activeTab} sessions
                        </h3>
                        <p className="text-sm text-muted max-w-sm mx-auto mb-6">
                            {activeTab === 'upcoming' 
                                ? "You don't have any scheduled sessions coming up. Browse tutors to book one!" 
                                : activeTab === 'ongoing' 
                                    ? "You don't have any sessions happening right now." 
                                    : "You haven't completed any sessions yet."}
                        </p>
                        {activeTab === 'upcoming' && user?.role === 'student' && (
                            <button onClick={() => navigate('/browse-tutors')} className="h-11 mt-4 bg-primary text-white px-8 rounded-xl font-bold shadow-md hover:bg-primary-dark transition-colors">
                                Browse Tutors
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 stagger-children">
                        {displayed.map((session) => (
                            <div key={session.id} className="animate-slide-up">
                                <SessionCard
                                    session={session}
                                    currentUserId={user?.id}
                                    onCancel={() => handleCancel(session.id)}
                                    onReview={handleReview}
                                    onNotes={handleNotes}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}
