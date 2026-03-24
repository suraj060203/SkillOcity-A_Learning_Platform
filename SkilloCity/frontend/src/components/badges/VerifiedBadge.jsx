import { ShieldCheck } from 'lucide-react';

export default function VerifiedBadge({ className = '' }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-success ${className}`}>
            <ShieldCheck size={12} /> Verified Teacher
        </span>
    );
}
