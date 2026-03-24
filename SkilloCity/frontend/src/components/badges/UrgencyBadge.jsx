import { URGENCY_LEVELS } from '../../utils/constants';

export default function UrgencyBadge({ urgency = 'normal', className = '' }) {
    const config = URGENCY_LEVELS[urgency] || URGENCY_LEVELS.normal;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}
            style={{ backgroundColor: config.bg, color: config.color }}
        >
            {config.emoji} {config.label}
        </span>
    );
}
