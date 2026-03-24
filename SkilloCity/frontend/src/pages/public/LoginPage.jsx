import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Logo from '../../components/common/Logo';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!email) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format';
        if (!password) errs.password = 'Password is required';
        else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const result = await login(email, password);
            toast.success('Welcome back.');
            navigate(result.user.role === 'teacher' ? '/teacher/dashboard' : '/dashboard');
        } catch (err) {
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-zinc-50 relative selection:bg-zinc-200 selection:text-zinc-900 overflow-hidden text-zinc-950 font-sans">
            
            {/* Absolute positioning for mobile logo to keep header clean */}
            <div className="absolute top-6 left-6 z-50 lg:hidden">
                 <Link to="/" className="outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm inline-block"><Logo size="md" /></Link>
            </div>

            {/* Left panel - Pure Typographic Branding (Vercel style) */}
            <div className="hidden lg:flex flex-1 flex-col justify-between p-16 relative bg-zinc-950 border-r border-zinc-800">
                <div className="relative z-10 animate-fade-up">
                    <Link to="/" className="outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm inline-block"><Logo size="lg" light className="mb-24" /></Link>
                    
                    <h1 className="font-display text-5xl xl:text-6xl text-white mb-8 leading-[1.1] tracking-tight">
                        Accelerate your <br/>academic potential.
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-md font-medium tracking-tight leading-relaxed">
                        Join the most focused student community. High-leverage peer learning without the friction.
                    </p>
                </div>

                {/* Testimonial Quote injected directly into the dark panel */}
                <div className="relative z-10 animate-fade-up border-l-2 border-zinc-700 pl-6 max-w-lg mt-auto" style={{ animationDelay: '200ms' }}>
                    <p className="text-zinc-300 text-[15px] leading-relaxed font-serif italic mb-4">
                        "The caliber of tutors here is unmatched. I went from struggling in Data Structures to acing my midterms in exactly three sessions."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border-border-zinc-700 flex items-center justify-center text-zinc-300 text-xs font-bold">
                            AL
                        </div>
                        <div>
                             <p className="text-white text-sm font-bold tracking-tight">Alex Li</p>
                             <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">CS Major • Stanford</p>
                        </div>
                    </div>
                </div>
                
                {/* Subtle grid backing */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            </div>

            {/* Right panel - Strict Minimalist Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white lg:bg-zinc-50">
                <div className="w-full max-w-[380px] animate-fade-up relative z-10" style={{ animationDelay: '100ms' }}>
                    
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-display text-zinc-950 mb-3 tracking-tight">Log in</h2>
                        <p className="text-zinc-500 font-medium text-[15px] tracking-tight">Enter your institutional details to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@university.edu"
                            error={errors.email}
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            error={errors.password}
                        />

                        <div className="flex items-center justify-between pt-2 pb-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="w-4 h-4 rounded border border-zinc-300 bg-white flex items-center justify-center group-hover:border-zinc-900 transition-colors">
                                    {/* Checked state would render a box here, simulating visually */}
                                    <div className="w-2 h-2 rounded-sm bg-zinc-900 opacity-0 group-active:opacity-10" />
                                </div>
                                <span className="text-[13px] font-medium text-zinc-600 group-hover:text-zinc-950 transition-colors">Remember device</span>
                            </label>
                            <Link to="/forgot-password" className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">Forgot password?</Link>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full h-11 flex items-center justify-center gap-2 rounded-md transition-all text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary shadow-sm shrink-0 ${loading ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-border' : 'bg-primary text-white hover:bg-primary-dark active:translate-y-[1px]'}`}
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-600 rounded-full animate-spin shrink-0" />
                            ) : (
                                <>Sign In <ArrowRight size={16} className="shrink-0 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-[13px] text-zinc-600 font-medium mt-8">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary font-bold hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">Create one now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
