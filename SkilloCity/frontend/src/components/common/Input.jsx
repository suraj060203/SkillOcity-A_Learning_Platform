import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
    label, type = 'text', error, helperText, leftIcon: LeftIcon,
    rightIcon: RightIcon, className = '', ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={`space-y-1.5 w-full shrink-0 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-text">
                    {label}
                </label>
            )}
            <div className="relative group flex items-center">
                {LeftIcon && (
                    <span className="absolute left-3 text-muted shrink-0 pointer-events-none">
                        <LeftIcon size={16} />
                    </span>
                )}
                
                <input
                    type={inputType}
                    className={`
                        w-full h-10 px-3 rounded-md text-sm text-text bg-white transition-colors
                        border border-border shadow-sm outline-none
                        placeholder:text-muted/60 placeholder:font-normal
                        focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900
                        hover:border-zinc-300
                        ${LeftIcon ? 'pl-9' : ''}
                        ${isPassword || RightIcon ? 'pr-9' : ''}
                        ${error ? 'border-danger focus:border-danger focus:ring-danger hover:border-danger' : ''}
                        ${props.disabled ? 'opacity-60 cursor-not-allowed bg-zinc-50' : ''}
                    `}
                    {...props}
                />
                
                {isPassword && (
                    <button
                        type="button"
                        className="absolute right-3 text-muted/80 hover:text-text transition-colors p-1 rounded outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 shrink-0"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
                
                {!isPassword && RightIcon && (
                    <span className="absolute right-3 text-muted shrink-0 pointer-events-none">
                        <RightIcon size={16} />
                    </span>
                )}
            </div>
            
            {(error || helperText) && (
                <p className={`text-[13px] mt-1 ${error ? 'text-danger font-medium' : 'text-muted'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
}
