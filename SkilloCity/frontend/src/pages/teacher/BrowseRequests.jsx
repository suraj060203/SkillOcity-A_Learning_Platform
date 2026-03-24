import { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, Calendar, Filter, SortDesc } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import RequestCard from '../../components/cards/RequestCard';
import Spinner from '../../components/common/Spinner';
import { SUBJECTS } from '../../utils/constants';
import requestService from '../../services/requestService';
import toast from 'react-hot-toast';

export default function BrowseRequests() {
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [urgencyFilter, setUrgencyFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const data = await requestService.getAll({
                    subject: subjectFilter !== 'all' ? subjectFilter : undefined,
                    urgency: urgencyFilter !== 'all' ? urgencyFilter : undefined,
                    sortBy,
                });
                setRequests(data);
            } catch (err) {
                console.error('Error fetching requests:', err);
                toast.error('Failed to load requests');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [subjectFilter, urgencyFilter, sortBy]);

    const handleAccept = async (id) => {
        try {
            await requestService.accept(id);
            toast.success('Request accepted! ✅');
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to accept');
        }
    };
    const handleDecline = async (id) => {
        try {
            await requestService.decline(id);
            toast.success('Request declined ✕');
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to decline');
        }
    };

    return (
        <PageWrapper>
            <div className="max-w-5xl mx-auto page-enter py-4 sm:py-8">
                
                {/* ── Header Banner ── */}
                <div className="card-premium overflow-hidden border-0 shadow-lg p-0 mb-8 z-0 relative" style={{ background: 'linear-gradient(135deg, #111827 0%, #374151 100%)' }}>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                         <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse-slow" />
                         <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
                    </div>
                    <div className="p-8 sm:p-10 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="text-white">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold mb-4 backdrop-blur-sm border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                Live Feed
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-display mb-2">Help Requests</h1>
                            <p className="text-white/70 max-w-sm text-sm">Students need your expertise. Browse open requests and pick up new sessions to boost your earnings.</p>
                        </div>
                        <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center min-w-[140px]">
                            <p className="text-4xl font-bold text-white mb-1">{requests.length}</p>
                            <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Available Now</p>
                        </div>
                    </div>
                </div>

                {/* ── Filter Bar ── */}
                <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-4 mb-8 flex flex-col md:flex-row items-center gap-4 sticky top-6 z-20">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Filter size={18} className="text-muted hidden md:block" />
                        <select
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                            className="flex-1 md:flex-none h-11 px-4 bg-gray-50 border border-border/60 rounded-xl text-sm font-semibold text-text focus:outline-none focus:border-primary focus:bg-white transition-colors cursor-pointer"
                        >
                            <option value="all">📚 All Subjects</option>
                            {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
                        </select>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar pb-1 md:pb-0">
                        {[
                            { key: 'all', label: 'All Urgencies' },
                            { key: 'urgent', label: '🟡 Urgent' },
                            { key: 'exam-soon', label: '🔴 Exam Soon' },
                        ].map(f => (
                            <button
                                key={f.key}
                                onClick={() => setUrgencyFilter(f.key)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${urgencyFilter === f.key
                                        ? 'bg-gradient-primary text-white shadow-sm'
                                        : 'bg-white border border-border/80 text-muted hover:text-text hover:bg-gray-50'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto ml-auto">
                        <SortDesc size={18} className="text-muted hidden md:block" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 md:flex-none h-11 px-4 bg-gray-50 border border-border/60 rounded-xl text-sm font-semibold text-text focus:outline-none focus:border-primary focus:bg-white transition-colors cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="urgent">Most Urgent</option>
                        </select>
                    </div>
                </div>

                {/* ── Request list ── */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card-premium p-6">
                                <div className="flex gap-4"><div className="skeleton w-12 h-12 rounded-full" /><div className="flex-1 space-y-2.5 pt-1"><div className="skeleton h-4 w-1/3" /><div className="skeleton h-3 w-full" /></div></div>
                            </div>
                        ))}
                    </div>
                ) : requests.length === 0 ? (
                    <div className="card-premium py-20 text-center border-2 border-dashed border-border/60 bg-gray-50/30">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-border/40 text-muted">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-text mb-2">
                            No requests match your filters
                        </h3>
                        <p className="text-sm text-muted max-w-sm mx-auto mb-6">
                            Try broadening your search or check back later! Students post new requests every day.
                        </p>
                        <button onClick={() => { setSubjectFilter('all'); setUrgencyFilter('all'); }} className="btn-outline px-6 rounded-xl">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 stagger-children">
                        {requests.map((req) => (
                            <div key={req.id} className="animate-slide-up">
                                <RequestCard request={req} onAccept={handleAccept} onDecline={handleDecline} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}
