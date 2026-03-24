import { ROLES } from '../../utils/constants';

export default function RoleBadge({ role, className = '' }) {
    const config = ROLES[role] || ROLES.student;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
            style={{ backgroundColor: config.color + '15', color: config.color }}
        >
            {config.emoji} {config.label}
        </span>
    );
}
