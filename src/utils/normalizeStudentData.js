const normalizeStudentData = (data) => {
    const normalized = { ...data }

    if (normalized.prefix && typeof normalized.prefix === 'string') {
        normalized.prefix = normalized.prefix.trim().toUpperCase();
    }

    if (normalized.customPrefix && typeof normalized.customPrefix === 'string') {
        normalized.customPrefix = normalized.customPrefix.trim();
    }

    if (normalized.firstName && typeof normalized.firstName === 'string') {
        normalized.firstName = normalized.firstName.trim();
    }

    if (normalized.lastName && typeof normalized.lastName === 'string') {
        normalized.lastName = normalized.lastName.trim();
    }

    if (normalized.email && typeof normalized.email === 'string') {
        normalized.email = normalized.email.trim().toLowerCase();
    }

    if (normalized.mobile && typeof normalized.mobile === 'string') {
        normalized.mobile = normalized.mobile.trim();
    }

    return normalized;
}

module.exports = { normalizeStudentData };