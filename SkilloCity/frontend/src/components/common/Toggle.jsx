export default function Toggle({ checked = false, onChange, label, className = '' }) {
    return (
        <label className={`flex items-center justify-between cursor-pointer ${className}`}>
            {label && <span className="text-sm text-text">{label}</span>}
            <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-gray-300'
                    }`}
                onClick={() => onChange(!checked)}
            >
                <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'
                        }`}
                />
            </div>
        </label>
    );
}
