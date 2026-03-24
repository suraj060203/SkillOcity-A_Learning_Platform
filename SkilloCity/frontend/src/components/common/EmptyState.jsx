import Button from './Button';

export default function EmptyState({ icon, title, description, actionLabel, onAction, className = '' }) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
            {icon && <div className="text-5xl mb-4">{icon}</div>}
            <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
            {description && <p className="text-sm text-muted max-w-sm mb-6">{description}</p>}
            {actionLabel && onAction && (
                <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
            )}
        </div>
    );
}
