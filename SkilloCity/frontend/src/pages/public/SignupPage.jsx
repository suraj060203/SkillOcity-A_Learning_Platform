import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import SubjectPill from '../../components/common/SubjectPill';
import Logo from '../../components/common/Logo';
import { SUBJECTS, YEAR_OPTIONS } from '../../utils/constants';
import { getPasswordStrength } from '../../utils/validators';
import toast from 'react-hot-toast';
import { Check, ChevronLeft, ChevronRight, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuthContext();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', password: '',
        college: '', year: '', role: '', subjects: [], bio: '',
    });
    const [errors, setErrors] = useState({});
    const [search, setSearch] = useState('');

    const strength = getPasswordStrength(form.password);

    const update = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateStep1 = () => {
        const errs = {};
        if (!form.firstName.trim()) errs.firstName = 'Required';
        if (!form.lastName.trim()) errs.lastName = 'Required';
        if (!form.email) errs.email = 'Required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid format';
        if (!form.password) errs.password = 'Required';
        else if (form.password.length < 6) errs.password = 'Min 6 chars';
        if (!form.college.trim()) errs.college = 'Required';
        if (!form.year) errs.year = 'Required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateStep2 = () => {
        if (!form.role) { setErrors({ role: 'Select a role' }); return false; }
        setErrors({});
        return true;
    };

    const next = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        setStep(s => Math.min(s + 1, 3));
    };
    const back = () => setStep(s => Math.max(s - 1, 1));

    const toggleSubject = (id) => {
        setForm(prev => {
            const subjects = prev.subjects.includes(id)
                ? prev.subjects.filter(s => s !== id)
                : prev.subjects.length < 5 ? [...prev.subjects, id] : prev.subjects;
            return { ...prev, subjects };
        });
    };

    const filteredSubjects = SUBJECTS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    const handleSubmit = async () => {
        if (form.subjects.length === 0) { toast.error('Select at least 1 subject'); return; }
        setLoading(true);
        try {
            await signup(form);
            toast.success('Account created.');
            navigate(form.role === 'teacher' ? '/teacher/dashboard' : '/dashboard');
        } catch (err) {
            const msg = err?.response?.data?.message || 'Signup failed. Please try again.';
            toast.error(msg);
        }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative py-12 bg-white selection:bg-zinc-200 selection:text-zinc-900 font-sans text-zinc-950">
            {/* Minimalist Grid backings */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            <div className="absolute top-8 left-8 hidden lg:block z-50">
                 <Link to="/" className="outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm inline-block"><Logo size="md" /></Link>
            </div>

            <div className="relative z-10 w-full max-w-[560px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-200 overflow-hidden animate-fade-up">
                
                {/* STRICT MINIMALIST STEPPER */}
                <div className="px-8 pt-8 pb-6 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="text-center mb-6 lg:hidden"><Logo /></div>
                    <div className="flex items-center justify-between">
                        {[
                            { num: 1, label: 'Account' },
                            { num: 2, label: 'Path' },
                            { num: 3, label: 'Details' },
                        ].map((s, i) => {
                            const isPast = step > s.num;
                            const isActive = step === s.num;
                            
                            return (
                                <div key={s.num} className={`flex items-center ${i === 2 ? 'flex-none' : 'flex-1'}`}>
                                    <div className="flex flex-col items-center relative z-10">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${
                                            isPast || isActive ? 'bg-primary text-white' : 'bg-white text-muted border border-border'
                                        }`}>
                                            {isPast ? <Check size={14} strokeWidth={3} /> : s.num}
                                        </div>
                                        <span className={`absolute top-10 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest hidden sm:block ${
                                            isPast || isActive ? 'text-zinc-900' : 'text-zinc-400'
                                        }`}>{s.label}</span>
                                    </div>
                                    {i < 2 && (
                                        <div className="flex-1 mx-3 h-[1px] bg-zinc-200 overflow-hidden">
                                            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: isPast ? '100%' : '0%' }} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="px-6 sm:px-10 py-8 sm:py-10 bg-white min-h-[460px] flex flex-col">
                    
                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="space-y-6 flex-1 animate-fade-up">
                            <div className="text-center sm:text-left mb-6">
                                <h1 className="text-2xl font-display text-zinc-950 tracking-tight">Create account</h1>
                                <p className="text-[13px] text-zinc-500 font-medium">Join the focused peer-learning network.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="First Name" value={form.firstName} onChange={e => update('firstName', e.target.value)} error={errors.firstName} placeholder="Jane" />
                                <Input label="Last Name" value={form.lastName} onChange={e => update('lastName', e.target.value)} error={errors.lastName} placeholder="Doe" />
                            </div>
                            
                            <Input label="Institutional Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} error={errors.email} placeholder="name@university.edu" />
                            
                            <div>
                                <Input label="Password" type="password" value={form.password} onChange={e => update('password', e.target.value)} error={errors.password} placeholder="••••••••" />
                                {form.password && (
                                    <div className="mt-3 bg-zinc-50 p-3 rounded-md border border-zinc-200">
                                        <div className="flex gap-1 mb-2">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="h-1 flex-1 rounded-sm transition-colors duration-300" style={{ backgroundColor: i <= strength.segments ? (strength.segments > 2 ? '#10B981' : '#09090B') : '#E5E7EB' }} />
                                            ))}
                                        </div>
                                        <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{strength.label}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="University" value={form.college} onChange={e => update('college', e.target.value)} error={errors.college} placeholder="E.g. Stanford" />
                                <div className="space-y-1.5 shrink-0">
                                    <label className="text-[13px] font-medium text-zinc-900">Current Year</label>
                                    <div className="relative">
                                        <select 
                                            value={form.year} 
                                            onChange={e => update('year', e.target.value)}
                                            className={`appearance-none w-full h-10 px-3 pr-8 bg-white border rounded-md text-[13px] font-medium transition-colors outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 ${errors.year ? 'border-red-500' : 'border-zinc-300'}`}
                                        >
                                            <option value="" disabled>Select Year</option>
                                            {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                    {errors.year && <p className="text-[11px] text-red-500 font-medium">{errors.year}</p>}
                                </div>
                            </div>
                            
                            <div className="pt-4 mt-auto">
                                <button onClick={next} className="w-full h-11 bg-primary text-white rounded-md font-medium text-[13px] transition-all hover:bg-primary-dark active:translate-y-[1px] flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                    Continue <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="space-y-6 flex-1 animate-fade-up flex flex-col">
                            <div className="text-center sm:text-left mb-4">
                                <h1 className="text-2xl font-display text-zinc-950 tracking-tight">Select your path</h1>
                                <p className="text-[13px] text-zinc-500 font-medium">You can change this later in settings.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { role: 'student', title: 'I want to Learn', desc: 'Find tutors & request help.' },
                                    { role: 'teacher', title: 'I want to Teach', desc: 'Share knowledge & build profile.' },
                                ].map((r) => {
                                    const isSelected = form.role === r.role;
                                    return (
                                        <button
                                            key={r.role}
                                            onClick={() => update('role', r.role)}
                                            className={`relative p-5 rounded-md border text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${isSelected ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' : 'border-zinc-200 bg-white hover:border-zinc-400'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border mb-4 flex items-center justify-center transition-colors ${isSelected ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300'}`}>
                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                            <h3 className="text-[15px] font-bold text-zinc-900 tracking-tight mb-1">{r.title}</h3>
                                            <p className="text-[13px] text-zinc-500 font-medium">{r.desc}</p>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.role && <p className="text-[13px] font-medium text-red-600 bg-red-50 p-2 rounded text-center border border-red-100">{errors.role}</p>}
                            
                            <div className="mt-auto pt-4 flex gap-3">
                                <button onClick={back} className="w-24 h-11 bg-white border border-zinc-200 text-zinc-700 rounded-md font-medium text-[13px] hover:bg-zinc-50 transition-colors flex items-center justify-center gap-1 active:translate-y-[1px] outline-none focus-visible:ring-2 focus-visible:ring-zinc-900">
                                    Back
                                </button>
                                <button onClick={next} className="flex-1 h-11 bg-primary text-white rounded-md font-medium text-[13px] transition-all hover:bg-primary-dark active:translate-y-[1px] flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                    Continue <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div className="space-y-6 flex-1 animate-fade-up flex flex-col">
                            <div className="text-center sm:text-left mb-2">
                                <h1 className="text-2xl font-display text-zinc-950 tracking-tight">
                                    {form.role === 'teacher' ? 'Your expertise' : 'Topics you need help with'}
                                </h1>
                                <p className="text-[13px] text-zinc-500 font-medium">Select up to 5 core subjects.</p>
                            </div>

                            <div className="space-y-3">
                                <Input placeholder="Search subjects..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                
                                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md">
                                    <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-2 scrollbar-hide">
                                        {filteredSubjects.length === 0 ? (
                                            <p className="text-[13px] text-zinc-500 italic w-full text-center py-4">No subjects found.</p>
                                        ) : (
                                            filteredSubjects.map((s) => (
                                                <button key={s.id} onClick={() => toggleSubject(s.id)} className="outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-full active:translate-y-[1px] transition-transform">
                                                    <SubjectPill subjectId={s.id} selected={form.subjects.includes(s.id)} className="font-semibold shadow-none border border-zinc-200" />
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{form.subjects.length} selected</span>
                                </div>
                            </div>

                            {form.role === 'teacher' && (
                                <div className="space-y-3 pt-3 border-t border-zinc-100 shrink-0">
                                    <div className="space-y-1.5 shrink-0">
                                        <label className="text-[13px] font-medium text-zinc-900">Bio (Optional)</label>
                                        <textarea
                                            className="w-full h-[72px] p-3 bg-white border border-zinc-200 rounded-md text-[13px] font-medium focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all resize-none block placeholder:text-zinc-400"
                                            value={form.bio}
                                            onChange={e => update('bio', e.target.value)}
                                            placeholder="Previous TA experience, etc."
                                            maxLength={200}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-4 flex gap-3 shrink-0">
                                <button onClick={back} className="w-24 h-11 bg-white border border-zinc-200 text-zinc-700 rounded-md font-medium text-[13px] hover:bg-zinc-50 transition-colors flex items-center justify-center gap-1 active:translate-y-[1px] outline-none focus-visible:ring-2 focus-visible:ring-zinc-900">
                                    Back
                                </button>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={loading}
                                    className={`flex-1 h-11 rounded-md font-medium text-[13px] flex items-center justify-center gap-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shrink-0 ${loading ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark active:translate-y-[1px]'}`}
                                >
                                    {loading ? <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-600 rounded-full animate-spin shrink-0" /> : 'Complete Setup'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 text-center border-t border-zinc-100 pt-5 shrink-0">
                        <p className="text-[13px] font-medium text-zinc-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-zinc-900 font-bold hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
