export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!re.test(email)) return 'Please enter a valid email';
    return null;
}

export function validatePassword(password) {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
}

export function getPasswordStrength(password) {
    if (!password) return { score: 0, label: '', segments: 0 };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
    return { score, label: labels[score], color: colors[score], segments: score };
}

export function validateRequired(value, fieldName = 'This field') {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} is required`;
    }
    return null;
}

export function validateName(name) {
    if (!name) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return null;
}

export function validateMaxLength(value, max, fieldName = 'Field') {
    if (value && value.length > max) return `${fieldName} must be ${max} characters or less`;
    return null;
}

export function validateSubjects(subjects, min = 1, max = 5) {
    if (!subjects || subjects.length < min) return `Please select at least ${min} subject(s)`;
    if (subjects.length > max) return `You can select up to ${max} subjects`;
    return null;
}
