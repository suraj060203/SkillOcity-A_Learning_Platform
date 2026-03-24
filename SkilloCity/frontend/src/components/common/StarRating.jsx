import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, max = 5, size = 16, interactive = false, onChange, className = '' }) {
    return (
        <div className={`inline-flex items-center gap-0.5 ${className}`}>
            {Array.from({ length: max }).map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    className={`transition-colors ${i < Math.floor(rating)
                            ? 'text-warning fill-warning'
                            : i < rating
                                ? 'text-warning fill-warning/50'
                                : 'text-gray-300'
                        } ${interactive ? 'cursor-pointer hover:text-warning' : ''}`}
                    onClick={() => interactive && onChange?.(i + 1)}
                />
            ))}
        </div>
    );
}
