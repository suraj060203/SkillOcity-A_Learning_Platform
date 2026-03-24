import { useId } from 'react';

export default function Logo({ size = 'md', light = false, className = '' }) {
    const uid = useId().replace(/:/g, '');
    const sizes = {
        sm: { icon: 24, text: 'text-base', gap: 'gap-1.5' },
        md: { icon: 30, text: 'text-xl', gap: 'gap-2' },
        lg: { icon: 40, text: 'text-2xl', gap: 'gap-2.5' },
    };
    const s = sizes[size] || sizes.md;

    return (
        <span className={`inline-flex items-center ${s.gap} select-none ${className}`}>
            <svg
                width={s.icon}
                height={s.icon}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                <defs>
                    <linearGradient id={`lg-${uid}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#3B2FCC" />
                        <stop offset="100%" stopColor="#FF6B35" />
                    </linearGradient>
                    <linearGradient id={`cg-${uid}`} x1="12" y1="10" x2="28" y2="26" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#E8E6FF" />
                    </linearGradient>
                </defs>
                {/* White outline ring behind the logo for dark backgrounds */}
                {light && <rect x="-1" y="-1" width="42" height="42" rx="11" fill="white" fillOpacity="0.15" />}
                <rect width="40" height="40" rx="10" fill={`url(#lg-${uid})`} />
                {/* Graduation cap */}
                <path d="M20 12L8 18L20 24L32 18L20 12Z" fill={`url(#cg-${uid})`} opacity="0.95" />
                <path d="M14 20.5V26C14 26 16.5 29 20 29C23.5 29 26 26 26 26V20.5"
                    fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                <path d="M30 18.5V25" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
                <circle cx="30" cy="26" r="1.2" fill="white" opacity="0.7" />
                {/* Sparkles */}
                <circle cx="10" cy="12" r="1" fill="white" opacity="0.5" />
                <circle cx="33" cy="10" r="0.8" fill="white" opacity="0.4" />
            </svg>
            <span className={`font-display font-extrabold leading-none ${s.text} ${light ? 'text-white' : 'text-primary'}`}>
                Skillo<span className={light ? 'text-amber-300' : 'text-accent'}>City</span>
            </span>
        </span>
    );
}
