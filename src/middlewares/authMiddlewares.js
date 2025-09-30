const jwt = require("jsonwebtoken");
const { errorResponse } = require('../utils/response')

const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return errorResponse(res, 401, 'No token provided.')

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return errorResponse(res, 401, 'Invalid token format.');

    if (!process.env.JWT_SECRET) {
        console.error('JWT secret is not defined!')
        return errorResponse(res, 400, 'Server configuration error.')
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return errorResponse(res, 401, 'Invalid or expired token')
        req.user = user;
        next();
    });
};


module.exports = { authenticate };