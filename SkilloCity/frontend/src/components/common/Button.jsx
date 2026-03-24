import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-primary text-white border border-transparent hover:bg-primary-dark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary shadow-sm hover:shadow-md hover:-translate-y-0.5',
    outline: 'bg-white text-primary border border-border hover:bg-primary-light hover:text-primary-dark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary shadow-sm hover:-translate-y-0.5',
    ghost: 'bg-transparent text-muted hover:bg-primary-light hover:text-primary-dark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
    danger: 'bg-danger text-white border border-transparent hover:bg-danger-dark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-danger shadow-sm hover:shadow-md hover:-translate-y-0.5'
};

const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-8 text-base',
};

export default function Button({
    children, variant = 'primary', size = 'md', loading = false,
    disabled = false, icon: Icon, fullWidth = false, className = '', ...props
}) {
    // Pure minimal interaction: subtle translate, no obnoxious scale
    const interactionClass = disabled || loading ? '' : 'active:translate-y-[1px]';
    
    return (
        <button
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center gap-2 font-medium rounded-md
                transition-colors outline-none shrink-0 shadow-sm
                ${variants[variant]} ${sizes[size]}
                ${fullWidth ? 'w-full' : ''}
                ${disabled || loading ? 'opacity-50 cursor-not-allowed shadow-none' : interactionClass}
                ${className}
            `}
            {...props}
        >
            {loading ? <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin shrink-0" /> : Icon && <Icon size={size === 'sm' ? 14 : 16} className="shrink-0" />}
            {/* Truncate text logic guarantees no weird stretching if flex parent forces squeeze */}
            <span className="truncate">{children}</span>
        </button>
    );
}
