export default function Spinner({ size = 32, className = '' }) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className="border-4 border-primary-light border-t-primary rounded-full animate-spin"
                style={{ width: size, height: size }}
            />
        </div>
    );
}
