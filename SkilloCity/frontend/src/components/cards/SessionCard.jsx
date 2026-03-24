import { Video, FileText, Calendar, Clock, ArrowRight } from 'lucide-react';
import Avatar from '../common/Avatar';
import SubjectPill from '../common/SubjectPill';
import { formatSessionTime, getSessionDuration, getTimeUntil, isStartingSoon, isWithin24Hours } from '../../utils/formatters';

export default function SessionCard({ session, currentUserId, onJoin, onReview, onNotes, onCancel }) {
    const otherPerson = session.teacher?.id === currentUserId ? session.student : session.teacher;
    const duration = getSessionDuration(session.startTime, session.endTime);
    const timeUntil = getTimeUntil(session.startTime);
    const startingSoon = isStartingSoon(session.startTime);
    const within24 = isWithin24Hours(session.startTime);

    const statusConfig = {
        upcoming: { label: 'Upcoming', bg: 'bg-zinc-100', text: 'text-zinc-900', dot: 'bg-zinc-900' },
        ongoing: { label: 'Ongoing', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
        completed: { label: 'Completed', bg: 'bg-zinc-50', text: 'text-zinc-500', dot: 'bg-zinc-400' },
        cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    };
    const status = statusConfig[session.status] || statusConfig.upcoming;

    return (
        <div className="card-premium p-0 flex flex-col group h-full">
            {/* Countdown banner for upcoming sessions */}
            {session.status === 'upcoming' && within24 && timeUntil && (
                <div className="bg-gradient-to-r from-primary to-indigo-600 text-white px-5 py-2 flex items-center gap-2 shrink-0">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-widest truncate">Starts in {timeUntil}</span>
                </div>
            )}

            <div className="p-5 flex-1 flex flex-col min-w-0">
                {/* Header Sequence */}
                <div className="flex items-start justify-between gap-4 mb-4 shrink-0">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <SubjectPill subjectId={session.subject} size="sm" selected className="shadow-none border border-border shrink-0" />
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border border-border/50 ${status.bg} ${status.text} shrink-0`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${session.status === 'ongoing' ? 'animate-pulse' : ''}`} />
                            {status.label}
                        </span>
                    </div>
                </div>

                <div className="mb-6 min-w-0 shrink-0">
                    <h3 className="text-base font-bold text-text leading-snug line-clamp-2">{session.topic}</h3>
                </div>

                {/* Info List (Minimal vertical stack replacing complex grids) */}
                <div className="space-y-3 mb-6 shrink-0 mt-auto">
                    <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={otherPerson?.name} size={32} className="shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium text-muted uppercase tracking-wider leading-none mb-1">With</p>
                            <p className="text-sm font-semibold text-text truncate leading-none">{otherPerson?.name}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                        <div className="w-8 h-8 rounded-md bg-zinc-50 border border-border flex items-center justify-center text-muted shrink-0">
                            <Calendar size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-text truncate">
                                {formatSessionTime(session.startTime, session.endTime).split(',')[0]}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                        <div className="w-8 h-8 rounded-md bg-zinc-50 border border-border flex items-center justify-center text-muted shrink-0">
                            <Clock size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-muted truncate">
                                {formatSessionTime(session.startTime, session.endTime).split(',')[1] || duration + ' mins'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions strictly bottom-aligned via mt-auto conceptually handled above, this is the action bar */}
                <div className="flex items-center flex-wrap gap-2 pt-4 border-t border-border shrink-0">
                    {(session.status === 'upcoming' || session.status === 'ongoing') && (
                        <button
                            onClick={() => window.open(session.meetLink, '_blank')}
                            className={`flex flex-1 h-9 px-4 rounded-md font-semibold text-[13px] items-center justify-center gap-2 transition-colors border shadow-sm shrink-0 min-w-0 ${startingSoon || session.status === 'ongoing' ? 'bg-primary text-white border-transparent hover:bg-primary-dark' : 'bg-white text-text border-border hover:bg-zinc-50'}`}
                        >
                            <Video size={14} className="shrink-0" /> 
                            <button
                                onClick={() => {
                                    window.open("https://meet.google.com/new", "_blank");
                                }}
                                className="flex items-center justify-center w-full"
                                >
                                Join Room
                            </button>
                        </button>
                    )}
                    
                    {session.status === 'upcoming' && (
                        <button onClick={onNotes} className="h-9 px-3 rounded-md border border-border bg-white text-text hover:bg-zinc-50 transition-colors font-medium text-[13px] flex items-center gap-2 shadow-sm shrink-0">
                            <FileText size={14} className="shrink-0" /> <span className="truncate hidden sm:inline">Notes</span>
                        </button>
                    )}

                    {session.status === 'completed' && !session.reviewed && (
                        <button onClick={onReview} className="flex-1 h-9 bg-primary border border-transparent text-white rounded-md font-semibold hover:bg-primary-dark transition-colors shadow-sm text-[13px] flex items-center justify-center gap-2 shrink-0 min-w-0">
                            <span className="truncate">Submit Review</span> <ArrowRight size={14} className="shrink-0" />
                        </button>
                    )}
                    
                    {session.status === 'completed' && session.reviewed && (
                        <div className="h-9 px-3 bg-zinc-50 text-muted rounded-md font-medium text-[13px] flex items-center justify-center gap-1.5 border border-border shrink-0 min-w-0">
                            <span className="truncate">Reviewed</span>
                        </div>
                    )}
                    
                    {session.status === 'completed' && session.notes && (
                        <button onClick={onNotes} className="h-9 px-3 rounded-md border border-border bg-white text-text hover:bg-zinc-50 transition-colors font-medium text-[13px] flex items-center gap-2 shadow-sm shrink-0 min-w-0">
                            <FileText size={14} className="shrink-0" /> <span className="truncate">Read Notes</span>
                        </button>
                    )}
                </div>

                {/* Management Links for Upcoming */}
                {session.status === 'upcoming' && (
                    <div className="w-full flex justify-between items-center mt-3 shrink-0">
                        <button className="text-[12px] font-medium text-muted hover:text-text transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">Reschedule</button>
                        <button onClick={onCancel} className="text-[12px] font-medium text-danger hover:text-red-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-sm">Cancel Session</button>
                    </div>
                )}

                {/* Notes preview cleanly formatted without yellow boxes */}
                {session.status === 'completed' && session.notes && (
                    <div className="mt-4 p-4 bg-zinc-50 border border-border rounded-md shrink-0">
                        <p className="text-[11px] font-semibold text-muted tracking-wider mb-2 flex items-center gap-1.5 uppercase"><FileText size={12}/> Notes</p>
                        <p className="text-sm text-text leading-relaxed font-serif">"{session.notes}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
