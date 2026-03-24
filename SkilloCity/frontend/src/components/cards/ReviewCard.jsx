import Avatar from '../common/Avatar';
import StarRating from '../common/StarRating';
import { formatDate } from '../../utils/formatters';
import { Quote } from 'lucide-react';

export default function ReviewCard({ review, compact = false }) {
    return (
        <div className={`card-premium relative overflow-hidden group hover:shadow-md transition-shadow ${compact ? 'p-4' : 'p-6'}`}>
            <div className="absolute -top-4 -right-4 text-primary/5 group-hover:text-primary/10 transition-colors transform -rotate-12 group-hover:scale-110 duration-300 pointer-events-none">
                <Quote size={80} fill="currentColor" />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <StarRating rating={review.rating} size={compact ? 12 : 16} />
                    {review.date && <p className="text-[10px] font-bold text-muted uppercase tracking-wider">{formatDate(review.date)}</p>}
                </div>
                
                <p className={`text-sm md:text-base font-medium text-text leading-relaxed mb-6 italic ${compact ? 'line-clamp-3' : ''}`}>
                    "{review.text}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                    <Avatar name={review.reviewer.name} size={compact ? 32 : 40} className="shadow-sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text truncate">{review.reviewer.name}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider truncate">{review.reviewer.college}</p>
                    </div>
                </div>
                
                {review.subject && (
                    <div className="absolute bottom-4 right-4">
                        <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-muted rounded-full border border-border/60">
                            {review.subject}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
