export default function Textarea({ label, error, helperText, maxLength, className = '', ...props }) {
    const charCount = props.value?.length || 0;
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && <label className="block text-sm font-medium text-text">{label}</label>}
            <textarea
                className={`
          w-full px-4 py-3 border rounded-md text-text text-sm transition-all duration-200 resize-y min-h-[100px]
          focus:outline-none focus:border-primary focus:shadow-focus placeholder:text-muted/50
          ${error ? 'border-danger' : 'border-border'}
        `}
                maxLength={maxLength}
                {...props}
            />
            <div className="flex justify-between">
                {(error || helperText) && <p className={`text-xs ${error ? 'text-danger' : 'text-muted'}`}>{error || helperText}</p>}
                {maxLength && <span className="text-xs text-muted ml-auto">{charCount}/{maxLength}</span>}
            </div>
        </div>
    );
}
