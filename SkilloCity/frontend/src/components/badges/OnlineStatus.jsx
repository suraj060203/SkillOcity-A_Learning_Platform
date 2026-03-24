export default function OnlineStatus({ label = true, className = '' }) {
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-success ${className}`}>
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            {label && 'Online Now'}
        </span>
    );
}
