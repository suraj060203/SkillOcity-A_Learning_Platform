import { format, formatDistanceToNow, isToday, isTomorrow, differenceInMinutes, differenceInHours } from 'date-fns';

export function formatDate(date) {
    const d = new Date(date);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'EEEE, MMM d');
}

export function formatTime(date) {
    return format(new Date(date), 'h:mm a');
}

export function formatDateTime(date) {
    return format(new Date(date), 'MMM d, yyyy • h:mm a');
}

export function formatRelativeTime(date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatSessionTime(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    return `${format(s, 'EEEE, MMM d')} • ${format(s, 'h:mm a')} – ${format(e, 'h:mm a')}`;
}

export function getSessionDuration(start, end) {
    return differenceInMinutes(new Date(end), new Date(start));
}

export function getTimeUntil(date) {
    const now = new Date();
    const target = new Date(date);
    const hours = differenceInHours(target, now);
    const mins = differenceInMinutes(target, now) % 60;
    if (hours <= 0 && mins <= 0) return null;
    if (hours === 0) return `${mins} minutes`;
    return `${hours} hours ${mins} minutes`;
}

export function isStartingSoon(date, thresholdMinutes = 30) {
    const mins = differenceInMinutes(new Date(date), new Date());
    return mins > 0 && mins <= thresholdMinutes;
}

export function isWithin24Hours(date) {
    const hours = differenceInHours(new Date(date), new Date());
    return hours > 0 && hours <= 24;
}

export function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

export function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

export function formatCount(num) {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}
