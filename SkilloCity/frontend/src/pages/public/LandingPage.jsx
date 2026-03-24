import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { SUBJECTS } from '../../utils/constants';
import { mockTestimonials } from '../../utils/mockData';
import { ArrowRight, BookOpen, Quote } from 'lucide-react';

function useCountUp(end, duration = 2000) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started) setStarted(true);
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [started, end, duration]);

    return { count, ref };
}

export default function LandingPage() {
    const navigate = useNavigate();
    const stat1 = useCountUp(1500);
    const stat2 = useCountUp(300);
    const stat3 = useCountUp(50);

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-zinc-200 selection:text-zinc-900">
            <Navbar />

            {/* ─── Hero Section (Minimalist Typography) ─── */}
            <section className="pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center items-center text-center">
                <div className="animate-fade-up max-w-4xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-bold uppercase tracking-widest mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" /> Free Peer Learning Platform
                    </div>
                    
                    <h1 className="font-display text-5xl sm:text-7xl lg:text-[5rem] text-zinc-950 leading-[1.05] tracking-tight mb-8">
                        Master your courses.<br />
                        <span className="text-zinc-400">Learn together.</span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl text-center mb-10 leading-relaxed font-medium tracking-tight">
                        Join the smartest students on campus. Get free 1-on-1 tutoring or share your expertise to help others succeed. No credit card required. Ever.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                        <button onClick={() => navigate('/signup')} className="w-full sm:w-auto h-12 px-8 bg-zinc-950 text-white rounded-md font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 text-[15px] shadow-sm active:translate-y-[1px] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-950 shrink-0">
                            Start Learning Free <ArrowRight size={16} />
                        </button>
                        <button onClick={() => navigate('/signup')} className="w-full sm:w-auto h-12 px-8 bg-white border border-zinc-200 text-zinc-900 rounded-md font-medium hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2 text-[15px] shadow-sm active:translate-y-[1px] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-950 shrink-0">
                            Become a Tutor
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── Minimal Stats Metrics ─── */}
            <section ref={stat1.ref} className="border-y border-zinc-100 bg-zinc-50/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-zinc-200/60">
                    {[
                        { value: stat1.count, suffix: '+', label: 'Active Students' },
                        { value: stat2.count, suffix: '+', label: 'Verified Tutors' },
                        { value: stat3.count, suffix: '+', label: 'Subjects Covered' },
                        { value: 100, suffix: '%', label: 'Free Forever' },
                    ].map((s, i) => (
                        <div key={i} className={`text-center px-4 ${i % 2 !== 0 ? 'border-l-0 sm:border-l border-zinc-200/60' : ''} ${i >= 2 ? 'border-t border-zinc-200/60 sm:border-t-0 pt-8 sm:pt-0' : ''}`}>
                            <div className="font-mono text-3xl md:text-4xl text-zinc-950 mb-2 tracking-tight font-medium">
                                {s.value}{s.suffix}
                            </div>
                            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── How It Works (Grid Layout) ─── */}
            <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-display text-zinc-950 mb-4 tracking-tight">How SkilloCity Works.</h2>
                    <p className="text-lg text-zinc-500 max-w-xl font-medium tracking-tight">Get the help you need or start teaching in three simple, absolutely free steps.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { step: "01", title: 'Create Profile', desc: 'Sign up in seconds. Tell us what you want to learn or what you can teach.' },
                        { step: "02", title: 'Find Your Match', desc: 'Search for expert tutors or browse open help requests from peers.' },
                        { step: "03", title: 'Learn Live 1-on-1', desc: 'Connect instantly via Google Meet for personalized, interactive learning.' },
                    ].map((item, i) => (
                        <div key={item.step} className="group border border-zinc-200 rounded-xl p-8 hover:border-zinc-900 transition-colors bg-white">
                            <div className="text-sm font-mono text-zinc-400 mb-8 border-b border-zinc-100 pb-4">{item.step}</div>
                            <h3 className="text-xl font-bold text-zinc-950 mb-3 tracking-tight">{item.title}</h3>
                            <p className="text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Subjects Section (Clean Tag Cloud) ─── */}
            <section id="subjects" className="py-24 bg-zinc-50 border-y border-zinc-100">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-display text-zinc-950 mb-4 tracking-tight">Master Any Subject</h2>
                    <p className="text-lg text-zinc-500 mb-12 max-w-xl mx-auto font-medium tracking-tight">From complex coding to advanced calculus, there's always a peer ready to help you out.</p>
                    
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        {SUBJECTS.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => navigate('/signup')}
                                className="group inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-zinc-200 text-sm font-medium transition-colors hover:border-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                            >
                                <span className="opacity-70 group-hover:opacity-100 transition-opacity"><BookOpen size={14}/></span>
                                <span className="text-zinc-700 group-hover:text-zinc-950 transition-colors">{s.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Testimonials (Editorial Style) ─── */}
            <section id="reviews" className="py-24 max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="mb-16 md:flex md:justify-between md:items-end">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display text-zinc-950 mb-4 tracking-tight">Loved by Students.</h2>
                        <p className="text-lg text-zinc-500 max-w-xl font-medium tracking-tight">Listen to the community that is already succeeding with SkilloCity.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {mockTestimonials.map((t, i) => (
                        <div key={i} className="border border-zinc-200 rounded-xl p-8 flex flex-col bg-white">
                            <Quote size={24} className="text-zinc-200 mb-6" />
                            <p className="text-zinc-700 leading-relaxed font-medium mb-8 flex-1 font-serif italic text-[15px]">"{t.text}"</p>
                            
                            <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-600 text-sm">
                                    {t.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-950">{t.name}</p>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t.college}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Minimal CTA Section ─── */}
            <section className="py-32 bg-zinc-950 text-white text-center px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Ready to ace your next exam?</h2>
                    <p className="text-lg text-zinc-400 font-medium mb-10 max-w-xl mx-auto tracking-tight">Join the SkilloCity community today. It takes less than 2 minutes to create an account and start learning.</p>
                    <button onClick={() => navigate('/signup')} className="h-12 px-8 bg-white text-zinc-950 rounded-md font-medium transition-colors hover:bg-zinc-200 text-[15px] flex items-center justify-center gap-2 mx-auto outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
                        Create Free Account <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
