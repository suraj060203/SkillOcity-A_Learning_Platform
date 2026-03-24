import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import Input from '../../components/common/Input';
import Logo from '../../components/common/Logo';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!email) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format';
        if (!password) errs.password = 'New password is required';
        else if (password.length < 6) errs.password = 'Must be at least 6 characters';
        if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
        else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const { data } = await api.post('/auth/reset-password', { email, password });
            toast.success(data.message);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-white font-sans text-zinc-950">
                <div className="text-center max-w-md animate-fade-up">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={32} className="text-green-500" />
                    </div>
                    <h1 className="text-2xl font-display text-zinc-950 mb-2">Password Updated!</h1>
                    <p className="text-zinc-500 text-sm">Your password has been changed successfully. Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative bg-white selection:bg-zinc-200 selection:text-zinc-900 font-sans text-zinc-950">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="absolute top-8 left-8 hidden lg:block z-50">
                <Link to="/" className="outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm inline-block"><Logo size="md" /></Link>
            </div>

            <div className="relative z-10 w-full max-w-[440px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-200 overflow-hidden animate-fade-up">
                <div className="px-8 pt-8 pb-6 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="text-center lg:hidden mb-4"><Logo /></div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Lock size={20} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-display text-zinc-950 tracking-tight">Reset Password</h1>
                            <p className="text-[12px] text-zinc-500 font-medium">Enter your email and choose a new password.</p>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-8">
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
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            error={errors.password}
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            error={errors.confirmPassword}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-11 flex items-center justify-center gap-2 rounded-md transition-all text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary shadow-sm ${loading ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-border' : 'bg-primary text-white hover:bg-primary-dark active:translate-y-[1px]'}`}
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-600 rounded-full animate-spin" />
                            ) : (
                                <>Update Password <ShieldCheck size={16} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
