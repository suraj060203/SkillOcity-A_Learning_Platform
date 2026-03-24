import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MessageSquare, Calendar, Clock, Users, BookOpen, Star, ShieldCheck, ArrowLeft, ExternalLink, Activity, Zap } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Avatar from '../../components/common/Avatar';
import SubjectPill from '../../components/common/SubjectPill';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/common/Button';
import ReviewCard from '../../components/cards/ReviewCard';
import Spinner from '../../components/common/Spinner';
import tutorService from '../../services/tutorService';

export default function TutorProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [activeSection, setActiveSection] = useState('about');

    useEffect(() => {
        const fetchTutor = async () => {
            try {
                const data = await tutorService.getById(id);
                setTutor(data);
                setReviews(data.reviews || []);
            } catch (err) {
                console.error('Error fetching tutor:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTutor();
    }, [id]);

    if (loading) return <PageWrapper><Spinner className="py-32" size={48} /></PageWrapper>;
    if (!tutor) return <PageWrapper><div className="card-premium max-w-md mx-auto mt-20 text-center py-12"><p className="text-4xl mb-4">🔍</p><h2 className="text-xl font-bold mb-2">Teacher not found</h2><p className="text-muted text-sm mb-6">The teacher you're looking for might have been removed.</p><Button onClick={() => navigate('/browse-tutors')}>Back to Directory</Button></div></PageWrapper>;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const slots = ['morning', 'afternoon', 'evening', 'night'];
    const slotEmoji = { morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙' };
    const slotLabels = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', night: 'Night' };

    const stats = [
        { icon: <BookOpen size={20} />, value: tutor.totalSessions || 0, label: 'Total Sessions', gradient: 'bg-gradient-primary' },
        { icon: <Users size={20} />, value: tutor.studentsHelped || 0, label: 'Students Helped', gradient: 'bg-gradient-success' },
        { icon: <Star size={20} />, value: tutor.rating || '0.0', label: 'Average Rating', gradient: 'bg-gradient-warning' },
        { icon: <Zap size={20} />, value: tutor.responseTime || 'Unknown', label: 'Response Time', gradient: 'bg-gradient-accent' },
    ];

    const sections = [
        { id: 'about', label: 'Overview' },
        { id: 'availability', label: 'Schedule' },
        { id: 'reviews', label: `Reviews (${reviews.length})` },
    ];

    return (
        <PageWrapper>
            <div className="max-w-5xl mx-auto page-enter pb-10 px-2 sm:px-0">
                {/* ─── Breadcrumb ─── */}
                <div className="flex items-center gap-2 text-sm text-muted mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium">
                        <div className="w-6 h-6 rounded-full bg-white border border-border/60 flex items-center justify-center shadow-sm"><ArrowLeft size={12} /></div>
                        Back
                    </button>
                    <span className="text-border/60">/</span>
                    <span className="text-text font-bold">{tutor.name}</span>
                </div>

                {/* ─── Hero Profile Card ─── */}
                <div className="card-premium overflow-hidden mb-8 p-0 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 bg-white/50 backdrop-blur-md">
                    {/* Gradient banner */}
                    <div className="h-48 sm:h-56 relative border-b border-black/[0.05] z-0 bg-gradient-to-tr from-indigo-950 via-primary to-purple-800">
                         <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/30 rounded-full blur-3xl animate-pulse-slow max-w-full" />
                            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl max-w-full" />
                            <div className="absolute inset-0 opacity-[0.08]" style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '24px 24px'
                            }} />
                        </div>

                        {/* Badges in Banner */}
                        <div className="absolute top-5 left-5 sm:top-6 sm:left-6 flex flex-wrap gap-2 z-10">
                            {tutor.isVerified && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-primary hover:bg-primary-dark text-white backdrop-blur-md border border-white/20 shadow-sm capitalize tracking-wider">
                                    <ShieldCheck size={14} className="text-success-light" /> Verified
                                </span>
                            )}
                            {tutor.isOnline && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold bg-success/20 text-white backdrop-blur-md border border-success/30 shadow-sm uppercase tracking-wider">
                                    <span className="w-2 h-2 bg-success-light text-white rounded-full animate-pulse" /> Online
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="px-6 sm:px-10 pb-8 relative z-10 -mt-16 sm:-mt-20">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="p-1.5 bg-white rounded-[2rem] shadow-xl">
                                    <Avatar name={tutor.name} size={140} rounded="rounded-[1.75rem]" className="border border-border/40" />
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left pt-2 w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-display text-text mb-1 leading-tight">{tutor.name}</h1>
                                        <p className="text-sm font-medium text-muted"> <span className="text-text">{tutor.college}</span> • {tutor.department} • {tutor.year}</p>
                                    </div>
                                    <div className="shrink-0 flex items-center justify-center gap-3">
                                        <button className="h-11 w-11 rounded-xl border border-border/80 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all bg-white shadow-sm active:scale-95">
                                            <MessageSquare size={18} />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/send-request/${tutor.id}`)}
                                            className="h-11 px-6 bg-gradient-accent text-white rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm hover:shadow-glow-accent transition-all active:scale-95"
                                        >
                                            <Calendar size={16} /> Request Session
                                        </button>
                                    </div>
                                </div>

                                {/* Subject pills */}
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {tutor.subjects.map(s => <SubjectPill key={s} subjectId={s} size="sm" selected />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Stats Grid (Moved here for immediate visibility and layout stability) ─── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="card-premium bg-white/70 backdrop-blur-md p-5 flex flex-col items-center justify-center text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group ring-1 ring-black/5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-110 transition-transform ${stat.gradient}`}>
                                {stat.icon}
                            </div>
                            <div className="text-2xl font-bold text-text mb-0.5">{stat.value}</div>
                            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* ─── Section Navigation ─── */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-black/[0.04] shadow-sm overflow-hidden p-1.5 flex gap-1 sticky top-6 z-20 ring-1 ring-white/50">
                            {sections.map((sec) => (
                                <button
                                    key={sec.id}
                                    onClick={() => setActiveSection(sec.id)}
                                    className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all duration-300 border ${activeSection === sec.id
                                            ? 'bg-primary text-white shadow-sm border-transparent'
                                            : 'text-muted hover:text-text hover:bg-white/50 border-transparent'
                                        }`}
                                >
                                    {sec.label}
                                </button>
                            ))}
                        </div>

                        {/* ── About ── */}
                        {activeSection === 'about' && (
                            <div className="card-premium bg-white/70 backdrop-blur-md space-y-8 animate-fade-in shadow-sm ring-1 ring-black/5">
                                <div>
                                    <h3 className="section-title text-lg mb-4">About {tutor.firstName}</h3>
                                    <div className="text-sm text-text/80 leading-relaxed space-y-4">
                                        {tutor.bio ? (
                                            tutor.bio.split('\n').map((para, i) => <p key={i}>{para}</p>)
                                        ) : (
                                            <p className="italic text-muted">This tutor hasn't written a bio yet.</p>
                                        )}
                                    </div>
                                </div>
                                <hr className="border-border/40" />
                                <div>
                                    <h3 className="section-title text-lg mb-4">Highlights</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { icon: <Activity size={16}/>, label: `${tutor.totalSessions || 0} Sessions completed`, bg: 'bg-emerald-50', text: 'text-emerald-700' },
                                            { icon: <Star size={16}/>, label: `${tutor.rating || '0.0'} Average rating`, bg: 'bg-amber-50', text: 'text-amber-700' },
                                            { icon: <ShieldCheck size={16}/>, label: 'Identity verified', bg: 'bg-blue-50', text: 'text-blue-700' },
                                            { icon: <Clock size={16}/>, label: `Usually responds ${tutor.responseTime?.toLowerCase() || 'quickly'}`, bg: 'bg-indigo-50', text: 'text-indigo-700' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:bg-gray-50 transition-colors">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} ${item.text}`}>
                                                    {item.icon}
                                                </div>
                                                <span className="text-sm font-semibold text-text">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Availability ── */}
                        {activeSection === 'availability' && (
                            <div className="card-premium bg-white/70 backdrop-blur-md animate-fade-in shadow-sm ring-1 ring-black/5">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="section-title text-lg mb-0 text-text font-bold flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary-light/50 flex items-center justify-center text-primary"><Calendar size={16}/></div>
                                        Weekly Schedule
                                    </h3>
                                    <span className="text-xs font-semibold text-muted bg-gray-50 px-3 py-1.5 rounded-lg border border-border/40">{tutor.timeZone || 'Local Time'}</span>
                                </div>
                                {tutor.availability ? (
                                    <div className="overflow-x-auto rounded-xl border border-border/40 mb-4 bg-gray-50/30">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border/40 bg-gray-50/80">
                                                    <th className="py-3 px-4 text-left font-bold text-xs text-muted uppercase tracking-wider w-28">Time Slot</th>
                                                    {days.map(d => (
                                                        <th key={d} className="py-3 px-2 font-bold text-xs text-text text-center uppercase tracking-wider">{d}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/20">
                                                {slots.map(slot => (
                                                    <tr key={slot} className="hover:bg-white transition-colors">
                                                        <td className="py-3 px-4 text-xs font-semibold text-text whitespace-nowrap border-r border-border/40 bg-gray-50/50">
                                                            <span className="mr-1.5 opacity-80">{slotEmoji[slot]}</span>
                                                            {slotLabels[slot]}
                                                        </td>
                                                        {days.map(day => {
                                                            const available = tutor.availability[day]?.includes(slot);
                                                            return (
                                                                <td key={day} className="py-2 px-1 text-center">
                                                                    {available ? (
                                                                        <div className="w-8 h-8 mx-auto rounded-lg bg-success-light text-success-dark flex items-center justify-center font-bold text-sm shadow-sm border border-success/10">
                                                                            ✓
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-8 h-8 mx-auto rounded-lg bg-gray-100 flex items-center justify-center text-muted/30 font-medium">
                                                                            -
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-16 border-2 border-dashed border-border/60 rounded-xl bg-gray-50/50">
                                        <Calendar size={32} className="mx-auto text-muted mb-3" />
                                        <p className="text-sm font-semibold text-text mb-1">No schedule set</p>
                                        <p className="text-xs text-muted max-w-[250px] mx-auto">This teacher hasn't set their recurring availability yet. You can still request a session!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Reviews ── */}
                        {activeSection === 'reviews' && (
                            <div className="card-premium bg-white/70 backdrop-blur-md space-y-6 animate-fade-in shadow-sm ring-1 ring-black/5">
                                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-primary/60 shadow-inner">
                                    <div className="text-center sm:text-left">
                                        <div className="text-5xl font-display text-amber-600 mb-1">{tutor.rating || '0.0'}</div>
                                        <StarRating rating={tutor.rating} size={18} className="justify-center sm:justify-start" />
                                        <p className="text-xs font-semibold text-amber-700 mt-2 uppercase tracking-wide">{reviews.length} total reviews</p>
                                    </div>
                                    <div className="hidden sm:block w-px h-20 bg-amber-200/60"></div>
                                    <div className="flex-1 w-full space-y-2.5">
                                        {[5, 4, 3, 2, 1].map(star => {
                                            const count = reviews.filter(r => Math.floor(r.rating) === star).length;
                                            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-3 text-xs font-semibold text-amber-900/80">
                                                    <span className="w-4 text-right">{star}</span>
                                                    <Star size={12} className="fill-amber-400 text-amber-400" />
                                                    <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="w-6 tabular-nums">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {reviews.length === 0 ? (
                                        <p className="text-center text-sm text-muted py-8">No reviews yet for this tutor.</p>
                                    ) : (
                                        (showAllReviews ? reviews : reviews.slice(0, 3)).map(review => (
                                            <ReviewCard key={review.id} review={review} />
                                        ))
                                    )}
                                </div>
                                {reviews.length > 3 && (
                                    <button
                                        onClick={() => setShowAllReviews(!showAllReviews)}
                                        className="w-full h-11 bg-gray-50 hover:bg-primary-light/30 border border-border/60 hover:border-primary/30 rounded-xl text-sm font-bold text-text hover:text-primary transition-all duration-200"
                                    >
                                        {showAllReviews ? 'Show Fewer Reviews' : `Read All ${reviews.length} Reviews`}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right column: Action Cards */}
                    <div className="space-y-4">
                        {/* Quick action card */}
                        <div className="card-premium bg-white/70 backdrop-blur-md border border-black/5 text-center py-8 px-6 shadow-sm ring-1 ring-black/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                            <div className="w-14 h-14 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar size={28} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-text">Ready to book?</h3>
                            <p className="text-xs text-muted mb-6">Send a request with your preferred time and topic. It's completely free.</p>
                            <button
                                onClick={() => navigate(`/send-request/${tutor.id}`)}
                                className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
                            >
                                Request Session <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

// Add ArrowRight for the button locally
function ArrowRight({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    );
}
