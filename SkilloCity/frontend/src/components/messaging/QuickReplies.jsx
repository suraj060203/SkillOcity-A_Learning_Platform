import { QUICK_REPLIES } from '../../utils/constants';

export default function QuickReplies({ onSelect, className = '' }) {
    return (
        <div className={`flex gap-2 overflow-x-auto pb-1 ${className}`}>
            {QUICK_REPLIES.map((reply) => (
                <button
                    key={reply}
                    onClick={() => onSelect(reply)}
                    className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-muted border border-border rounded-full hover:bg-primary-light hover:text-primary hover:border-primary transition-all shrink-0"
                >
                    {reply}
                </button>
            ))}
        </div>
    );
}
