const validateIdParams = (id) => {
    const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
        return false;
    }
    return idNum;
}

const validatePassword = (password) => {
    if (password.length < 8) {
        const error = new Error("Password must be at least 8 characters long.");
        error.statusCode = 400;
        throw error;
    }

    if (!/[A-Z]/.test(password)) {
        const error = new Error("Password must contain at least one uppercase letter.");
        error.statusCode = 400;
        throw error;
    }

    if (!/[a-z]/.test(password)) {
        const error = new Error("Password must contain at least one lowercase letter.");
        error.statusCode = 400;
        throw error;
    }

    if (!/[0-9]/.test(password)) {
        const error = new Error("Password must contain at least one number.");
        error.statusCode = 400;
        throw error;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        const error = new Error("Password must contain at least one special character.");
        error.statusCode = 400;
        throw error;
    }
}


const validateMobile = (mobile) => {
    if (!/^09\d{9}$/.test(mobile)) {
        const error = new Error("Mobile number must be 11 digits starting with 09.");
        error.statusCode = 400;
        throw error;
    }
}

const VALID_PREFIXES = ['MR', 'MS', 'DR', 'OTHER'];

const validatePrefix = (prefix, customPrefix) => {
    if (!VALID_PREFIXES.includes(prefix?.toUpperCase())) {
        const error = new Error(`Invalid prefix. Must be one of: ${VALID_PREFIXES.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }

    if (prefix.toUpperCase() === 'OTHER' && !customPrefix?.trim()) {
        const error = new Error("customPrefix is required when prefic is 'OTHER'.");
        error.statusCode = 400;
        throw error;
    }
}

module.exports = { validateIdParams, validatePassword, validateMobile, validatePrefix };