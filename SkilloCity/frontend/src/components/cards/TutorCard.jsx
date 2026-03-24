import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import SubjectPill from '../common/SubjectPill';
import StarRating from '../common/StarRating';

export default function TutorCard({ tutor, variant = 'default' }) {
    const navigate = useNavigate();
    const isCompact = variant === 'compact';

    return (
        <div
            className="group relative bg-white rounded-xl border border-border flex flex-col h-full transition-all duration-300 cursor-pointer overflow-hidden hover:border-zinc-900 hover:shadow-md"
            onClick={() => navigate(`/tutor/${tutor.id}`)}
        >
            <div className={`flex flex-col h-full ${isCompact ? 'p-4' : 'p-5'}`}>
                {/* Header Sequence */}
                <div className="flex items-start gap-4 mb-4 shrink-0">
                    <div className="relative shrink-0">
                        <Avatar name={tutor.name} size={isCompact ? 48 : 56} online={tutor.isOnline} className="border border-border/50" />
                        {tutor.isVerified && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-1.5 mb-1">
                            <h3 className="text-base font-bold text-text truncate leading-none group-hover:text-zinc-600 transition-colors">{tutor.name}</h3>
                        </div>
                        <p className="text-[11px] font-medium text-muted uppercase tracking-wider truncate leading-tight">{tutor.college}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                            <StarRating rating={tutor.rating} size={12} />
                            <span className="text-[11px] font-bold text-text">{tutor.rating}</span>
                            <span className="text-[10px] text-muted font-medium">({tutor.totalSessions || 0})</span>
                        </div>
                    </div>
                </div>

                {/* Sub-info layout */}
                <div className="mb-4 shrink-0 px-1">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {(tutor.subjects || []).slice(0, 3).map(s => (
                            <SubjectPill key={s} subjectId={s} size="sm" className="shadow-none border border-border" />
                        ))}
                        {(tutor.subjects || []).length > 3 && (
                            <span className="text-[10px] text-muted px-2 py-0.5 bg-zinc-50 border border-border rounded-md font-medium shrink-0">+{tutor.subjects.length - 3}</span>
                        )}
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                        {tutor.isOnline && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                            </span>
                        )}
                        {tutor.responseTime && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-50 text-muted border border-border shrink-0">
                                ⚡ {tutor.responseTime}
                            </span>
                        )}
                    </div>
                </div>

                {/* Intelligent content block combining Top Review or Why Recommended */}
                <div className="mt-auto shrink-0 space-y-3 pt-3 border-t border-border">
                    {tutor.whyRecommended && tutor.whyRecommended.length > 0 ? (
                        <div className="bg-zinc-50 rounded-md p-3 border border-border/50">
                            <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                                Recommended Match
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {tutor.whyRecommended.map((reason, i) => (
                                    <span key={i} className="text-[10px] font-medium text-zinc-700 bg-white border border-border px-1.5 py-0.5 rounded shrink-0">{reason}</span>
                                ))}
                            </div>
                        </div>
                    ) : tutor.topReview ? (
                        <div className="bg-zinc-50 rounded-md p-3 border border-border/50 relative">
                            <span className="absolute top-2 left-2 text-zinc-300 font-serif text-2xl leading-none">"</span>
                            <p className="text-[11px] text-zinc-700 leading-relaxed font-serif italic pl-5 line-clamp-2">
                                {tutor.topReview.text}
                            </p>
                        </div>
                    ) : null}

                    {/* Minimal pure action */}
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/tutor/${tutor.id}`); }}
                        className="w-full h-9 rounded-md text-xs font-semibold transition-colors border border-border bg-white text-text group-hover:bg-primary group-hover:text-white group-hover:border-transparent flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm shrink-0"
                    >
                        View Profile <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
