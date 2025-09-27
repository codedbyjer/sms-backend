const jwt = require("jsonwebtoken");
const { errorResponse } = require('../utils/response')

const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return errorResponse(res, 401, 'No token provided.')
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"
    if (!token) return errorResponse(res, 401, 'Invalid token format.');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return errorResponse(res, 403, 'Invalid or expired token')
        req.user = user;
        next();
    });
};


module.exports = { authenticate };