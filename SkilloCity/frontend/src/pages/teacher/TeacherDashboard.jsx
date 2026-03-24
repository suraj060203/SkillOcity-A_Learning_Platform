import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, TrendingUp, Users, Star, Calendar, Clock, Video, BookOpen, CheckCircle } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Spinner from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';
import { useAuthContext } from '../../context/AuthContext';
import { formatRelativeTime } from '../../utils/formatters';
import requestService from '../../services/requestService';
import sessionService from '../../services/sessionService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function TeacherDashboard() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reqData, sesData] = await Promise.all([
                    requestService.getAll(),
                    sessionService.getAll(),
                ]);
                setRequests(reqData);
                setSessions(sesData);
            } catch (err) {
                console.error('TeacherDashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAccept = async (id) => {
        try {
            await requestService.accept(id);
            toast.success('Request accepted.');
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to accept');
        }
    };
    
    const handleDecline = async (id) => {
        try {
            await requestService.decline(id);
            toast.success('Request declined');
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to decline');
        }
    };

    const upcomingToday = sessions.filter(s => s.status === 'upcoming' || s.status === 'ongoing').slice(0, 3);
    const today = new Date();
    const dayName = format(today, 'EEEE, MMMM d');

    if (loading) return <PageWrapper><Spinner className="py-32" size={48} /></PageWrapper>;

    return (
        <PageWrapper>
            <div className="max-w-6xl mx-auto py-8 px-6 lg:px-8">
                
                {/* ─── METRICS HEADER (Minimalist) ─── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-200 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <p className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest">{dayName}</p>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                            </span>
                        </div>
                        <h1 className="text-3xl font-display text-zinc-950 tracking-tight">
                            Welcome back, {user?.firstName}.
                        </h1>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 md:gap-8">
                        <div>
                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Users size={12}/> Students</p>
                            <p className="text-3xl font-mono font-medium text-zinc-950 tracking-tight">{user?.studentsHelped || 0}</p>
                        </div>
                        <div className="w-[1px] h-12 bg-zinc-200 hidden md:block" />
                        <div>
                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Star size={12}/> Rating</p>
                            <p className="text-3xl font-mono font-medium text-zinc-950 tracking-tight">{user?.rating || '0.0'}</p>
                        </div>
                        <div className="w-[1px] h-12 bg-zinc-200 hidden md:block" />
                        <div>
                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12}/> Sessions</p>
                            <p className="text-3xl font-mono font-medium text-zinc-950 tracking-tight">{sessions.filter(s => s.status === 'completed').length}</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-14">
                    {/* ─── LEFT COLUMN (Requests) ─── */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <div className="flex items-end justify-between mb-6 border-b border-zinc-200 pb-3">
                                <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
                                    Pending Requests
                                    {requests.length > 0 && (
                                        <span className="px-2 border border-zinc-200 bg-zinc-50 text-zinc-900 text-[10px] font-bold rounded-full">{requests.length} New</span>
                                    )}
                                </h2>
                                <button onClick={() => navigate('/browse-requests')} className="text-[12px] font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-widest transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">
                                    Browse Board →
                                </button>
                            </div>
                            
                            {requests.length === 0 ? (
                                <div className="border border-dashed border-zinc-300 rounded-md p-10 text-center bg-zinc-50/50">
                                    <p className="text-[13px] font-medium text-zinc-500">Inbox zero. You have no pending help requests.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {requests.slice(0, 3).map((req) => (
                                        <div key={req.id} className="p-5 border border-zinc-200 rounded-md bg-white hover:border-zinc-300 transition-colors animate-fade-up">
                                            <div className="flex flex-col sm:flex-row gap-5">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-3 shrink-0">
                                                        <Avatar name={req.student?.name} size={40} className="border border-zinc-200 shrink-0" />
                                                        <div className="min-w-0">
                                                            <h3 className="text-[14px] font-bold text-zinc-900 truncate">{req.student?.name}</h3>
                                                            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider truncate mt-0.5">{req.student?.college}</p>
                                                        </div>
                                                        <div className="ml-auto shrink-0 flex items-center gap-1.5">
                                                             {req.urgency === 'high' && <span className="w-2.5 h-2.5 rounded-full bg-red-500" title="High Priority" />}
                                                             {req.urgency === 'medium' && <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" title="Medium Priority" />}
                                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{formatRelativeTime(req.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-zinc-50 rounded-md p-3 mb-4 border border-zinc-200 shrink-0">
                                                        <div className="flex items-center gap-2 mb-2 min-w-0">
                                                            <span className="text-[10px] font-bold text-zinc-900 px-2 border border-zinc-200 bg-white rounded uppercase tracking-widest shrink-0">{req.subject}</span>
                                                            <span className="text-[12px] font-bold text-zinc-700 truncate">{req.topic}</span>
                                                        </div>
                                                        <p className="text-[13px] text-zinc-600 font-serif italic line-clamp-2">"{req.description}"</p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest shrink-0">
                                                        <span className="flex items-center gap-1.5"><Clock size={12} /> Prefers {req.preferredTime}</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Actions strictly constrained */}
                                                <div className="shrink-0 flex sm:flex-col gap-3 pt-1">
                                                    <button onClick={() => handleAccept(req.id)} className="flex-1 sm:flex-none h-10 px-6 rounded-md font-bold text-white bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shrink-0 shadow-sm border border-transparent">
                                                        <CheckCircle size={14} className="shrink-0" /> Accept
                                                    </button>
                                                    <button onClick={() => handleDecline(req.id)} className="flex-1 sm:flex-none h-10 px-4 rounded-md font-medium text-[13px] text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 hover:text-zinc-900 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 shrink-0">
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* ─── RIGHT COLUMN (Schedule & Quick) ─── */}
                    <div className="space-y-8">
                        <section>
                            <div className="flex items-end justify-between mb-6 border-b border-zinc-200 pb-3">
                                <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
                                    <Calendar size={16} /> Today's Schedule
                                </h2>
                            </div>
                            <div className="border border-zinc-200 rounded-md p-1 bg-white">
                                {upcomingToday.length === 0 ? (
                                    <div className="p-6 text-center">
                                        <p className="text-[13px] font-medium text-zinc-500">No sessions scheduled today.</p>
                                    </div>
                                ) : (
                                    upcomingToday.map(session => (
                                        <div key={session.id} className="p-4 rounded border border-transparent hover:border-zinc-200 transition-colors group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="min-w-0 pr-3">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold border ${session.status === 'ongoing' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-50 text-zinc-500 border-zinc-200'}`}>
                                                            {session.status === 'ongoing' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                                                            {session.status === 'ongoing' ? 'LIVE NOW' : session.time}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-[13px] font-bold text-zinc-900 truncate group-hover:text-zinc-600 transition-colors">{session.topic || session.subject}</h3>
                                                </div>
                                                <Avatar name={session.student?.name} size={32} className="shrink-0 border border-zinc-200" />
                                            </div>
                                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3 line-clamp-1">with {session.student?.name || 'Student'}</p>
                                            
                                            <button
                                                onClick={() => window.open(session.meetLink, '_blank')}
                                                className={`w-full h-9 rounded-md flex items-center justify-center gap-2 text-[12px] font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shrink-0 ${session.status === 'ongoing' ? 'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary' : 'border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 focus-visible:ring-primary'}`}
                                            >
                                                <Video size={14} className="shrink-0" /> {session.status === 'ongoing' ? 'Join Call' : 'Meet Link'}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className="bg-zinc-950 rounded-md p-6 relative overflow-hidden text-center sm:text-left">
                            <div className="relative z-10 flex flex-col h-full justify-center">
                                <h3 className="text-base font-bold text-white mb-2">Update availability</h3>
                                <p className="text-[13px] font-medium text-zinc-400 mb-6 leading-relaxed">Keep your calendar aligned to receive appropriate help requests.</p>
                                <button onClick={() => navigate('/profile')} className="h-9 px-4 rounded-md border border-transparent bg-primary hover:bg-primary-dark text-white text-[12px] font-bold transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary w-full sm:w-auto self-start">
                                    Manage Schedule
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
