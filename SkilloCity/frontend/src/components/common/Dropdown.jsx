import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({ label, options = [], value, onChange, placeholder = 'Select...', className = '' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`space-y-1.5 ${className}`} ref={ref}>
            {label && <label className="block text-sm font-medium text-text">{label}</label>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className={`
            w-full h-11 px-4 pr-10 border border-border rounded-md text-sm text-left
            transition-all duration-200 focus:outline-none focus:border-primary focus:shadow-focus
            bg-white flex items-center ${selected ? 'text-text' : 'text-muted/50'}
          `}
                >
                    {selected ? selected.label : placeholder}
                    <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-primary-light transition-colors ${opt.value === value ? 'bg-primary-light text-primary font-medium' : 'text-text'
                                    }`}
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
