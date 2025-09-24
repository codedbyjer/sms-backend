const normalizeStudentData = (data) => {
    if (data.prefix && typeof data.prefix === 'string') {
        data.prefix = data.prefix.trim();
    }
    if (data.firstName && typeof data.firstName === 'string') {
        data.firstName = data.firstName.trim();
    }
    if (data.lastName && typeof data.lastName === 'string') {
        data.lastName = data.lastName.trim();
    }
    if (data.email && typeof data.email === 'string') {
        data.email = data.email.trim().toLowerCase();
    }
    if (data.mobile && typeof data.mobile === 'string') {
        data.mobile = data.mobile.trim();
    }

    return data;
}

module.exports = { normalizeStudentData };