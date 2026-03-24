import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Toggle from '../../components/common/Toggle';
import Dropdown from '../../components/common/Dropdown';
import profileService from '../../services/profileService';
import { useAuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { BellRing, Paintbrush, Clock, LogOut, AlertTriangle, ChevronDown } from 'lucide-react';

export default function SettingsPage() {
    const { user, updateUser, logout } = useAuthContext();

    const [settings, setSettings] = useState({
        emailNotifications: user?.settings?.emailNotifications ?? true,
        pushNotifications: user?.settings?.pushNotifications ?? true,
        sessionReminders: user?.settings?.sessionReminders ?? true,
        newRequestAlerts: user?.settings?.newRequestAlerts ?? true,
        messageNotifications: user?.settings?.messageNotifications ?? true,
        darkMode: user?.settings?.darkMode ?? false,
        language: user?.settings?.language ?? 'en',
        availability: user?.settings?.availability ?? 'online',
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings.darkMode]);

    const update = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        // Automatically save on toggle for a smoother, modern feel
        handleSave({ ...settings, [key]: value });
    };

    const handleSave = async (newSettings = settings) => {
        setIsSaving(true);
        try {
            await profileService.updateSettings(newSettings);
            updateUser({ settings: { ...user?.settings, ...newSettings } });
            toast.success('Preferences updated', { id: 'settings-toast', duration: 2000 });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save settings');
            // Revert on error could be implemented here
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    const handleDeleteAccount = () => toast.error('Account deletion is permanently disabled for demo accounts.');

    const SectionBlock = ({ title, icon: Icon, children, className = '' }) => (
        <section className={`bg-white/70 backdrop-blur-xl dark:bg-zinc-900/80 rounded-3xl p-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-200/50 dark:ring-white/10 ${className}`}>
            <div className="px-5 py-4 flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300">
                    <Icon size={18} strokeWidth={2.5} />
                </div>
                <h2 className="text-[17px] font-bold text-zinc-900 dark:text-white tracking-tight">{title}</h2>
            </div>
            <div className="p-2">
                {children}
            </div>
        </section>
    );

    const ToggleRow = ({ label, description, checked, onChange, isLast }) => (
        <label className={`flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors ${!isLast ? 'border-b border-zinc-100 dark:border-zinc-800/50' : ''}`}>
            <div className="pr-4">
                <div className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">{label}</div>
                <div className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</div>
            </div>
            <Toggle checked={checked} onChange={onChange} />
        </label>
    );

    return (
        <PageWrapper>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-20 animate-fade-up">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-4xl sm:text-5xl font-display text-zinc-950 dark:text-white mb-3 tracking-tight">Preferences</h1>
                    <p className="text-[15px] font-medium text-zinc-500 dark:text-zinc-400">Manage your notifications, appearance, and availability.</p>
                </div>

                <div className="space-y-8">
                    {/* Settings Cards container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        
                        <div className="space-y-8">
                            {/* Notifications */}
                            <SectionBlock title="Notifications" icon={BellRing}>
                                <div className="flex flex-col">
                                    <ToggleRow label="Email Notifications" description="Important updates via email" checked={settings.emailNotifications} onChange={(v) => update('emailNotifications', v)} />
                                    <ToggleRow label="Push Alerts" description="Real-time browser notifications" checked={settings.pushNotifications} onChange={(v) => update('pushNotifications', v)} />
                                    <ToggleRow label="Session Reminders" description="15 mins before a session starts" checked={settings.sessionReminders} onChange={(v) => update('sessionReminders', v)} />
                                    <ToggleRow label="Request Alerts" description="When students request help" checked={settings.newRequestAlerts} onChange={(v) => update('newRequestAlerts', v)} />
                                    <ToggleRow label="Chat Messages" description="New messages in inbox" checked={settings.messageNotifications} onChange={(v) => update('messageNotifications', v)} isLast />
                                </div>
                            </SectionBlock>
                        </div>

                        <div className="space-y-8">
                            {/* Availability */}
                            <SectionBlock title="Availability" icon={Clock}>
                                <div className="p-3">
                                    <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mb-4 px-1">Let others know when you're around to help.</p>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { id: 'online', label: 'Online', desc: 'Ready for requests', color: '#10B981', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
                                            { id: 'busy', label: 'Busy', desc: 'In a session', color: '#F59E0B', bg: 'bg-amber-50 text-amber-700 ring-amber-200' },
                                            { id: 'offline', label: 'Offline', desc: 'Not available currently', color: '#71717A', bg: 'bg-zinc-100 text-zinc-700 ring-zinc-300' },
                                        ].map(s => {
                                            const isSelected = settings.availability === s.id;
                                            return (
                                                <button
                                                    key={s.id}
                                                    onClick={() => update('availability', s.id)}
                                                    className={`relative flex items-center justify-between w-full p-4 rounded-2xl border transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                                        isSelected 
                                                            ? `border-transparent shadow-sm ring-1 z-10 ${s.bg}` 
                                                            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: s.color }} />
                                                        <div>
                                                            <div className="font-bold text-[14px] leading-none mb-1">{s.label}</div>
                                                            <div className={`text-[12px] font-medium leading-none ${isSelected ? 'opacity-80' : 'text-zinc-400'}`}>{s.desc}</div>
                                                        </div>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-current' : 'border-zinc-300 dark:border-zinc-700'}`}>
                                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </SectionBlock>

                            {/* Appearance */}
                            <SectionBlock title="Appearance" icon={Paintbrush}>
                                <div className="flex flex-col">
                                    <ToggleRow label="Dark Mode (Beta)" description="Switch to a darker theme" checked={settings.darkMode} onChange={(v) => update('darkMode', v)} />
                                    
                                    <div className="p-3 pt-4">
                                        <label className="text-[13px] font-bold text-zinc-900 dark:text-white mb-2 block px-1">Display Language</label>
                                        <div className="relative">
                                            <select
                                                value={settings.language}
                                                onChange={(e) => update('language', e.target.value)}
                                                className="w-full h-12 pl-4 pr-10 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[14px] font-medium text-zinc-900 dark:text-white appearance-none outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer shadow-sm"
                                            >
                                                <option value="en">🇺🇸 English US</option>
                                                <option value="hi">🇮🇳 Hindi</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </SectionBlock>
                        </div>
                    </div>

                    {/* Danger Zone & Logout (bottom full width) */}
                    <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-end border-t border-zinc-200/60 dark:border-zinc-800">
                        {/* Danger block */}
                        <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-3xl p-6">
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                                <AlertTriangle size={18} strokeWidth={2.5}/>
                                <h3 className="font-bold text-[15px]">Danger Zone</h3>
                            </div>
                            <p className="text-[13px] text-zinc-600 dark:text-zinc-400 font-medium mb-5">Once you delete your account, there is no going back. All data will be permanently erased.</p>
                            <button
                                onClick={handleDeleteAccount}
                                className="w-full h-11 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-[14px] font-bold rounded-xl shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
                            >
                                Delete Account
                            </button>
                        </div>

                        {/* Save Actions */}
                        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 flex flex-col justify-end">
                            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium mb-5 text-center px-4">Changes to your preferences are saved automatically, but you can securely log out here.</p>
                            <button 
                                onClick={handleLogout}
                                className="w-full h-12 bg-white dark:bg-zinc-800 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 dark:hover:bg-red-900/20 text-zinc-700 dark:text-zinc-300 font-bold text-[14px] rounded-xl transition-all shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                            >
                                <LogOut size={16} /> Secure Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
