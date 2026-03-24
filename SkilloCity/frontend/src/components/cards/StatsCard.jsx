export default function StatsCard({ icon, value, label, accent = false, className = '' }) {
    return (
        <div className={`bg-white rounded-lg border border-border p-5 text-center ${className}`}>
            {icon && <div className="text-2xl mb-2">{icon}</div>}
            <div className={`text-2xl font-bold ${accent ? 'text-accent' : 'text-primary'}`}>{value}</div>
            <div className="text-xs text-muted mt-1">{label}</div>
        </div>
    );
}
