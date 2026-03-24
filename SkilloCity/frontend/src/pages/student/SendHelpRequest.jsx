import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, Calendar, Clock, BookOpen, AlertCircle, X, Send } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Avatar from '../../components/common/Avatar';
import SubjectPill from '../../components/common/SubjectPill';
import { SUBJECTS, URGENCY_LEVELS, TIME_SLOTS, DAY_PREFERENCES } from '../../utils/constants';
import tutorService from '../../services/tutorService';
import requestService from '../../services/requestService';
import toast from 'react-hot-toast';

export default function SendHelpRequest() {
    const { tutorId } = useParams();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        subject: '',
        topic: '',
        urgency: 'normal',
        examDate: '',
        timeSlots: [],
        dayPreference: 'any',
        file: null,
    });

    useEffect(() => {
        if (tutorId) {
            tutorService.getById(tutorId).then(setTutor).catch(console.error);
        }
    }, [tutorId]);

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
    const toggleTimeSlot = (id) => {
        setForm(prev => ({
            ...prev,
            timeSlots: prev.timeSlots.includes(id) ? prev.timeSlots.filter(s => s !== id) : [...prev.timeSlots, id],
        }));
    };

    const handleSubmit = async () => {
        if (!form.subject) { toast.error('Please select a subject'); return; }
        if (!form.topic.trim()) { toast.error('Please describe your topic'); return; }
        setLoading(true);
        try {
            await requestService.create({
                subject: form.subject,
                topic: form.topic,
                urgency: form.urgency,
                examDate: form.examDate || undefined,
                preferredTime: form.timeSlots,
                dayPreference: form.dayPreference,
                targetTutor: tutorId || undefined,
                attachment: form.file || undefined,
            });
            toast.success('Help request sent successfully! 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    const subjectOptions = tutor ? (tutor.subjects || []).map(id => {
        const s = SUBJECTS.find(sub => sub.id === id);
        return { value: id, label: s ? `${s.emoji} ${s.name}` : id };
    }) : SUBJECTS.map(s => ({ value: s.id, label: `${s.emoji} ${s.name}` }));

    return (
        <PageWrapper>
            <div className="max-w-3xl mx-auto page-enter py-4 sm:py-8">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-text transition-colors bg-white px-4 py-2 rounded-xl border border-border/60 shadow-sm active:scale-95">
                        <ArrowLeft size={16} /> Back
                    </button>
                </div>

                <div className="card-premium p-0 overflow-hidden shadow-lg border-border/40">
                    <div className="bg-gradient-to-r from-primary-dark via-primary to-accent p-8 sm:p-10 text-white relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider mb-4 border border-white/20">
                                <BookOpen size={12} /> New Request
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-display mb-2">Get the help you need</h1>
                            <p className="text-white/80 text-sm max-w-md">Fill out the details below. The more specific you are, the faster a teacher can assist you.</p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 space-y-10">
                        
                        {/* 1. Target Teacher */}
                        {tutor && (
                            <section>
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted mb-4"><span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-text font-display">1</span> Teacher</h3>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 border border-border/60 rounded-2xl">
                                    <Avatar name={tutor.name} size={56} className="shadow-sm" />
                                    <div className="flex-1">
                                        <p className="text-base font-bold text-text mb-0.5">{tutor.name}</p>
                                        <div className="flex gap-1.5 mt-1">
                                            {tutor.subjects.slice(0, 3).map(s => <SubjectPill key={s} subjectId={s} size="sm" />)}
                                        </div>
                                    </div>
                                    <button onClick={() => navigate('/browse-tutors')} className="shrink-0 h-10 px-4 flex items-center gap-2 text-xs font-bold text-muted bg-white border border-border/80 rounded-xl hover:text-text hover:bg-gray-50 transition-colors">
                                        Change
                                    </button>
                                </div>
                            </section>
                        )}

                        {/* 2. Topic */}
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted mb-4"><span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-text font-display">{tutor ? '2' : '1'}</span> Topic & Details</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-text mb-2">Which subject is this for?</label>
                                    <div className="relative">
                                        <select 
                                            value={form.subject}
                                            onChange={(e) => update('subject', e.target.value)}
                                            className="w-full h-12 pl-4 pr-10 bg-white border-2 border-border/60 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer outline-none"
                                        >
                                            <option value="" disabled>Select a subject...</option>
                                            {subjectOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-text mb-2 flex justify-between">
                                        What exactly do you need help with?
                                        <span className="text-muted font-normal text-xs">{form.topic.length}/500</span>
                                    </label>
                                    <textarea
                                        value={form.topic}
                                        onChange={(e) => update('topic', e.target.value)}
                                        placeholder="E.g., I'm stuck on problem #4 from the textbook. I don't understand how the formula is applied here..."
                                        maxLength={500}
                                        rows={4}
                                        className="w-full p-4 bg-white border-2 border-border/60 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-text mb-2">Attach screenshots or files (optional)</label>
                                    {form.file ? (
                                        <div className="flex items-center gap-3 p-3 bg-primary-light/30 border border-primary/20 rounded-xl">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <Paperclip size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-text truncate">{form.file.name}</p>
                                                <p className="text-xs text-muted">{(form.file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <button onClick={() => update('file', null)} className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-border/60 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group">
                                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors group-hover:scale-110 duration-300">
                                                <Paperclip size={20} className="text-muted group-hover:text-primary transition-colors" />
                                            </div>
                                            <span className="text-sm font-bold text-text mt-1">Click to upload</span>
                                            <span className="text-xs text-muted text-center max-w-[200px]">PNG, JPG, PDF up to 5MB</span>
                                            <input type="file" className="hidden" onChange={(e) => update('file', e.target.files[0])} accept="image/*,.pdf" />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* 3. Urgency */}
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted mb-4"><span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-text font-display">{tutor ? '3' : '2'}</span> Priority</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {Object.values(URGENCY_LEVELS).map((u) => (
                                    <button
                                        key={u.key}
                                        onClick={() => update('urgency', u.key)}
                                        className={`relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden ${form.urgency === u.key
                                                ? 'shadow-md scale-[1.02]'
                                                : 'border-border/60 hover:border-gray-300 bg-white hover:bg-gray-50'
                                            }`}
                                        style={form.urgency === u.key ? { borderColor: u.color, backgroundColor: u.bg } : {}}
                                    >
                                        {form.urgency === u.key && (
                                            <div className="absolute top-0 right-0 w-16 h-16 blur-2xl opacity-20" style={{ backgroundColor: u.color }} />
                                        )}
                                        <div className="flex items-start gap-3 relative z-10">
                                            <div className="text-2xl">{u.emoji}</div>
                                            <div>
                                                <div className="text-sm font-bold mb-0.5" style={{ color: form.urgency === u.key ? u.color : 'var(--color-text)' }}>{u.label}</div>
                                                <div className="text-xs text-muted/80 leading-snug font-medium" style={form.urgency === u.key ? { color: u.color, opacity: 0.8 } : {}}>{u.text}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Animated expand for exam date */}
                            {form.urgency === 'exam-soon' && (
                                <div className="mt-4 p-5 bg-danger/5 border border-danger/20 rounded-xl animate-fade-in flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-danger shrink-0 shadow-sm">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-danger-dark mb-1">When is your exam?</label>
                                        <p className="text-xs text-danger/80 mb-3 sm:mb-0">This helps teachers prioritize your request</p>
                                    </div>
                                    <form className="relative w-full sm:w-auto min-w-[200px]" onSubmit={(e) => e.preventDefault()}>
                                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-danger" />
                                        <input
                                            type="date"
                                            value={form.examDate}
                                            onChange={(e) => update('examDate', e.target.value)}
                                            className="w-full h-11 pl-10 pr-4 bg-white border border-danger/30 rounded-lg text-sm font-bold text-danger-dark focus:outline-none focus:ring-2 focus:ring-danger/20"
                                        />
                                    </form>
                                </div>
                            )}
                        </section>

                        {/* 4. Time preferences */}
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted mb-4"><span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-text font-display">{tutor ? '4' : '3'}</span> Availability</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-semibold text-text mb-3">Which days work best for you?</p>
                                    <div className="flex flex-wrap gap-2">
                                        {DAY_PREFERENCES.map((d) => (
                                            <button
                                                key={d.id}
                                                onClick={() => update('dayPreference', d.id)}
                                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${form.dayPreference === d.id
                                                        ? 'bg-gradient-primary text-white shadow-sm'
                                                        : 'bg-white border border-border/80 text-muted hover:text-text hover:bg-gray-50'
                                                    }`}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-semibold text-text mb-3 flex justify-between items-center">
                                        What times do you prefer?
                                        <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Select Multiple</span>
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {TIME_SLOTS.map((slot) => {
                                            const isSelected = form.timeSlots.includes(slot.id);
                                            return (
                                                <button
                                                    key={slot.id}
                                                    onClick={() => toggleTimeSlot(slot.id)}
                                                    className={`p-3 rounded-xl border-2 text-center transition-all ${isSelected
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-border/60 bg-white text-muted hover:border-border hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="text-sm font-bold mb-0.5">{slot.label}</div>
                                                    <div className={`text-[11px] font-medium ${isSelected ? 'text-primary/70' : 'text-muted/60'}`}>{slot.time}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Submit */}
                        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-muted max-w-[280px] text-center sm:text-left">
                                By sending this request, teachers matching your criteria will be notified.
                            </p>
                            <button 
                                onClick={handleSubmit} 
                                disabled={loading}
                                className={`w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all ${loading ? 'opacity-70 cursor-not-allowed bg-gray-400' : 'bg-gradient-primary active:scale-95'}`}
                            >
                                {loading ? (
                                    <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Sending...</>
                                ) : (
                                    <>Send Request <Send size={18} /></>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
