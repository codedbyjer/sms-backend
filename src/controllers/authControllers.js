const { registerUser, loginUser, rotateRefreshToken, revokeRefreshToken } = require('../services/authService');
const { successResponse } = require('../utils/response');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7) * 24 * 60 * 60 * 1000,
}
const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const user = await registerUser(email, password, firstName, lastName);
        return successResponse(res, 201, "User Registered Successfully!", user);
    } catch (err) {
        next(err);
    }

}

const login = async (req, res, next) => {
    try {
        const { email, password, rememberMe } = req.body;
        const { accessToken, refreshToken, user } = await loginUser(email, password, rememberMe);

        if (refreshToken) {
            res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
        }

        return successResponse(res, 200, "Login Successfully!", { accessToken, user });
    } catch (err) {
        next(err);
    }
};


const refresh = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        const { accessToken, refreshToken, userId } = await rotateRefreshToken(token);

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        return successResponse(res, 200, "Token refreshed successfully", {
            accessToken,
            userId
        })

    } catch (error) {
        next(error);
    }
}


const logout = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        await revokeRefreshToken(token);
        res.clearCookie('refreshToken');
        return successResponse(res, 200, "Logged out successfully!")
    } catch (error) {
        next(error);
    }
}

module.exports = { register, login, refresh, logout };