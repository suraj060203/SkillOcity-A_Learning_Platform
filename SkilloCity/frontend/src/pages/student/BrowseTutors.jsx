import { useState, useEffect, useMemo } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import TutorCard from '../../components/cards/TutorCard';
import Toggle from '../../components/common/Toggle';
import StarRating from '../../components/common/StarRating';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { SUBJECTS } from '../../utils/constants';
import tutorService from '../../services/tutorService';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';

export default function BrowseTutors() {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [onlineOnly, setOnlineOnly] = useState(false);
    const [sortBy, setSortBy] = useState('sessions');
    const [loading, setLoading] = useState(true);
    const [showMoreSubjects, setShowMoreSubjects] = useState(false);
    const [tutors, setTutors] = useState([]);
    
    // Mobile filter sheet state
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        const fetchTutors = async () => {
            setLoading(true);
            try {
                let fetchMethod = tutorService.getAll;
                let filterParams = {
                    subject: selectedSubjects[0] || '',
                    onlineOnly,
                    minRating: minRating || undefined,
                    search: debouncedSearch || undefined,
                    sortBy,
                };

                const data = await fetchMethod(filterParams);
                setTutors(data);
            } catch (err) {
                console.error('Error fetching tutors:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTutors();
    }, [debouncedSearch, selectedSubjects, minRating, onlineOnly, sortBy]);

    const toggleSubject = (id) => {
        setSelectedSubjects(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const filtered = useMemo(() => {
        let results = [...tutors];
        if (selectedSubjects.length > 1) {
            results = results.filter(t => t.subjects?.some(s => selectedSubjects.includes(s)));
        }
        return results;
    }, [tutors, selectedSubjects]);

    const displaySubjects = showMoreSubjects ? SUBJECTS : SUBJECTS.slice(0, 6);

    const FilterSidebar = () => (
        <div className="space-y-8">
            {/* Search */}
            <div>
                <label className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3 block">Search keywords</label>
                <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Name, subject, college..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-12 pl-11 pr-4 bg-zinc-50/50 backdrop-blur-sm border border-zinc-200/80 rounded-2xl text-[14px] font-medium transition-all shadow-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-zinc-300 outline-none"
                    />
                </div>
            </div>

            {/* Subjects */}
            <div className="pt-6 border-t border-zinc-100">
                <label className="text-[11px] font-bold text-muted uppercase tracking-widest mb-4 block">Subjects</label>
                <div className="flex flex-col gap-1.5">
                    {displaySubjects.map((s) => (
                        <label key={s.id} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
                            <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                                <input
                                    type="checkbox"
                                    checked={selectedSubjects.includes(s.id)}
                                    onChange={() => toggleSubject(s.id)}
                                    className="peer appearance-none w-5 h-5 rounded-[6px] border-[1.5px] border-zinc-300 checked:bg-primary checked:border-primary transition-all cursor-pointer shadow-sm hover:border-zinc-400"
                                />
                                <svg className="absolute w-3 h-3 text-white pointer-events-none scale-50 opacity-0 peer-checked:scale-100 peer-checked:opacity-100 transition-all duration-200" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="2.5 7.5 5.5 10.5 11.5 3.5"/></svg>
                            </div>
                            <span className="text-[14.5px] font-medium text-zinc-700 group-hover:text-zinc-950 transition-colors">{s.emoji} {s.name}</span>
                        </label>
                    ))}
                    <button
                        onClick={() => setShowMoreSubjects(!showMoreSubjects)}
                        className="text-[13px] font-bold text-primary hover:text-primary-dark mt-2 p-2 -ml-2 inline-flex items-center gap-1.5 rounded-lg hover:bg-primary/5 transition-colors w-fit"
                    >
                        {showMoreSubjects ? 'Hide subjects' : 'View all subjects'}
                        <ArrowUpDown size={14} className={showMoreSubjects ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </button>
                </div>
            </div>

            {/* Rating */}
            <div className="pt-6 border-t border-zinc-100">
                <label className="text-[11px] font-bold text-muted uppercase tracking-widest mb-4 block">Minimum rating</label>
                <div className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] ring-1 ring-black/[0.02] text-center flex flex-col items-center justify-center group hover:border-zinc-200 transition-colors">
                    <StarRating rating={minRating} interactive onChange={setMinRating} size={24} className="justify-center mb-1.5 transition-transform group-hover:scale-[1.02]" />
                    {minRating > 0 ? (
                        <p className="text-[12px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full mt-1.5 inline-block">{minRating}.0 and above</p>
                    ) : (
                        <p className="text-[12px] font-medium text-zinc-400 mt-1.5">Any rating</p>
                    )}
                </div>
            </div>

            {/* Toggles */}
            <div className="pt-6 border-t border-zinc-100 space-y-4">
                <label className="flex items-center justify-between cursor-pointer group p-3 -mx-3 rounded-xl hover:bg-zinc-50 transition-colors">
                    <span className="text-[14.5px] font-semibold text-zinc-700 group-hover:text-zinc-950 transition-colors">Online right now</span>
                    <Toggle checked={onlineOnly} onChange={setOnlineOnly} />
                </label>
            </div>
        </div>
    );

    return (
        <PageWrapper>
            {/* Header section */}
            <div className="max-w-6xl mx-auto mb-8 sm:mb-12 mt-4 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display text-zinc-950 mb-3 tracking-tight">Find your next Tutor</h1>
                        <p className="text-[15px] font-medium text-zinc-500 max-w-lg">Browse {filtered.length} verified experts ready to accelerate your learning journey today.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button 
                            className="lg:hidden h-11 px-5 rounded-xl border border-zinc-200 bg-white font-bold text-[13px] text-zinc-700 flex items-center gap-2 hover:bg-zinc-50 hover:text-zinc-950 active:scale-95 transition-all outline-none shadow-sm"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            <Filter size={16} /> Filters
                        </button>
                        
                        <div className="relative shrink-0 w-full md:w-[220px]">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full h-11 pl-11 pr-10 bg-white border border-zinc-200 rounded-xl text-[14px] font-semibold text-zinc-700 appearance-none outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm transition-all hover:bg-zinc-50 cursor-pointer"
                            >
                                <option value="sessions">Most Experienced</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                            <SlidersHorizontal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 max-w-6xl mx-auto page-enter px-4 sm:px-6 lg:px-8 pb-12">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-[280px] shrink-0">
                    <div className="sticky top-[100px] bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-100">
                        <FilterSidebar />
                    </div>
                </aside>

                {/* Mobile Filter Sheet */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
                        <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm animate-fade-in" onClick={() => setShowMobileFilters(false)} />
                        <div className="relative w-full max-w-[340px] bg-white h-full flex flex-col shadow-2xl animate-slide-left rounded-l-3xl overflow-hidden ring-1 ring-zinc-200/50">
                            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white/80 backdrop-blur-xl z-10">
                                <h3 className="font-display text-xl text-zinc-950 tracking-tight flex items-center gap-2"><Filter size={20} className="text-primary"/> Filters</h3>
                                <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-950 rounded-full hover:bg-zinc-100 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1 bg-zinc-50/50">
                                <FilterSidebar />
                            </div>
                            <div className="p-6 border-t border-zinc-100 bg-white">
                                <button className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-[14px] font-bold rounded-xl shadow-md transition-all active:scale-[0.98]" onClick={() => setShowMobileFilters(false)}>
                                    Show {filtered.length} Teachers
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-100">
                                    <div className="flex gap-4"><div className="w-16 h-16 rounded-full bg-zinc-100 animate-pulse" /><div className="flex-1 space-y-3 pt-2"><div className="h-4 bg-zinc-100 rounded-md w-3/4 animate-pulse" /><div className="h-3 bg-zinc-50 rounded-md w-1/2 animate-pulse" /></div></div>
                                    <div className="h-10 bg-zinc-50 rounded-xl w-full mt-8 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-3xl flex flex-col items-center justify-center py-24 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-100 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
                            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex flex-col items-center justify-center mb-6 shadow-inner ring-4 ring-primary/5 relative z-10">
                                <Search size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-display text-zinc-950 mb-3 tracking-tight relative z-10">No tutors match your search</h3>
                            <p className="text-[15px] text-zinc-500 mb-8 max-w-sm font-medium relative z-10">We couldn't find any tutors with those exact filters. Try broadening your criteria or selecting fewer subjects.</p>
                            <button className="h-11 px-6 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-xl text-[14px] font-semibold text-zinc-700 shadow-sm transition-all active:scale-95 relative z-10" onClick={() => { setSearch(''); setSelectedSubjects([]); setMinRating(0); setOnlineOnly(false); }}>
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
                            {filtered.map((t) => (
                                <div key={t.id} className="animate-slide-up h-full">
                                    <TutorCard tutor={t} />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </PageWrapper>
    );
}

function ChevronDownIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );
}

const style = document.createElement('style');
style.innerHTML = `
@keyframes slideLeft {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}
.animate-slide-left { animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;
document.head.appendChild(style);
