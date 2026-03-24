import { getInitials } from '../../utils/formatters';

export default function Avatar({ name, src, size = 40, className = '', online }) {
    const initials = getInitials(name);
    const colors = ['#3B2FCC', '#FF6B35', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];
    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

    return (
        <div className={`relative inline-flex shrink-0 ${className}`} style={{ width: size, height: size }}>
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className="w-full h-full rounded-full object-cover"
                />
            ) : (
                <div
                    className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: colors[colorIndex], fontSize: size * 0.36 }}
                >
                    {initials}
                </div>
            )}
            {online !== undefined && (
                <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${online ? 'bg-success' : 'bg-gray-400'
                        }`}
                />
            )}
        </div>
    );
}
