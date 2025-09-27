const crypto = require('crypto');

const generateSecureRandomToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};


module.exports = { generateSecureRandomToken, hashToken };