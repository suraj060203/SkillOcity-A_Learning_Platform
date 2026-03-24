const variants = {
    primary: 'bg-primary-light text-primary',
    accent: 'bg-orange-50 text-accent',
    success: 'bg-emerald-50 text-success',
    warning: 'bg-amber-50 text-warning',
    danger: 'bg-red-50 text-danger',
    gray: 'bg-gray-100 text-muted',
};

export default function Badge({ children, variant = 'primary', dot = false, className = '' }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {dot && <span className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-success' : variant === 'danger' ? 'bg-danger' : variant === 'warning' ? 'bg-warning' : 'bg-primary'}`} />}
            {children}
        </span>
    );
}
