import { SUBJECTS } from '../../utils/constants';

export default function SubjectPill({ subjectId, selected = false, onClick, removable = false, onRemove, size = 'md' }) {
    const subject = SUBJECTS.find(s => s.id === subjectId) || { name: subjectId, emoji: '📚', color: '#6B7280' };
    const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1.5';

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200
        ${sizeClasses}
        ${selected
                    ? 'text-white shadow-sm scale-[1.02]'
                    : 'bg-gray-50 text-text hover:bg-gray-100'
                }
      `}
            style={selected ? { backgroundColor: subject.color } : {}}
        >
            <span>{subject.emoji}</span>
            <span>{subject.name}</span>
            {removable && (
                <span
                    className="ml-1 hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    onClick={(e) => { e.stopPropagation(); onRemove?.(subjectId); }}
                >
                    ×
                </span>
            )}
        </button>
    );
}
