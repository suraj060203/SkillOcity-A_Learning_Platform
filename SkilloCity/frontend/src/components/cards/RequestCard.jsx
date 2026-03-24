import Avatar from '../common/Avatar';
import SubjectPill from '../common/SubjectPill';
import UrgencyBadge from '../badges/UrgencyBadge';
import { formatRelativeTime } from '../../utils/formatters';
import { URGENCY_LEVELS, TIME_SLOTS } from '../../utils/constants';
import { CalendarDays } from 'lucide-react';

export default function RequestCard({ request, onAccept, onDecline, showActions = true }) {
    const urgency = URGENCY_LEVELS[request.urgency] || URGENCY_LEVELS.normal;

    return (
        <div className="card-premium p-0 flex flex-col h-full bg-white relative">
            {/* Top Minimal Edge Indicator (instead of whole side border) */}
            <div 
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-80"
                style={{ backgroundColor: urgency.color }}
            />
            
            <div className="p-6 flex flex-col h-full min-w-0">
                <div className="flex items-start justify-between gap-4 mb-5 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={request.student.name} size={40} className="shrink-0 border border-border" />
                        <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-text truncate">{request.student.name}</h4>
                            <p className="text-[11px] font-medium text-muted uppercase tracking-wider truncate mt-0.5">{request.student.college}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">{formatRelativeTime(request.postedAt)}</span>
                    </div>
                </div>

                <div className="mb-5 shrink-0">
                    <div className="flex flex-wrap gap-2 items-center mb-3">
                        <SubjectPill subjectId={request.subject} size="sm" selected className="shadow-none border border-border" />
                        <UrgencyBadge urgency={request.urgency} />
                    </div>
                    <h5 className="text-base font-bold text-text mb-2 leading-snug break-words">{request.topic}</h5>
                    <div className="border-l-2 border-border pl-3 mt-3 shrink-0">
                        <p className="text-sm text-muted leading-relaxed line-clamp-3 my-0 font-serif italic">"{request.description}"</p>
                    </div>
                </div>

                <div className="mt-auto shrink-0 space-y-4 pt-2">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-muted shrink-0" size={14} />
                        <span className="text-xs font-medium text-muted truncate">
                            {request.preferredTime?.map(t => {
                                const slot = TIME_SLOTS.find(s => s.id === t);
                                return slot?.label;
                            }).filter(Boolean).join(', ')} • {request.dayPreference === 'any' ? 'Any Day' : request.dayPreference}
                        </span>
                    </div>

                    {showActions && (
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDecline?.(request.id); }}
                                className="h-9 px-4 bg-white border border-border hover:bg-zinc-50 rounded-md font-medium text-sm text-text transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 shrink-0 shadow-sm"
                            >
                                Decline
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onAccept?.(request.id); }}
                                className="flex-1 h-9 bg-primary text-white rounded-md font-bold text-sm hover:bg-primary-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm min-w-0 truncate"
                            >
                                Accept Request
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
