const { registerUser, loginUser } = require('../services/authService');
const { successResponse } = require('../utils/response');

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await registerUser(email, password);
        return successResponse(res, 201, "User Registered Successfully!", user);
    } catch (err) {
        next(err);
    }

}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { token, safeUser } = await loginUser(email, password);
        return successResponse(res, 200, "Login Successfully!", { token, user: safeUser });
    } catch (err) {
        next(err);
    }
};


module.exports = { register, login };