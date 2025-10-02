const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { generateSecureRandomToken, hashToken } = require('../utils/token');
const { validatePassword } = require('../middlewares/validate')

const BCRYPT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '7', 10);
const REFRESH_EXPIRY_MS = REFRESH_DAYS * 24 * 60 * 60 * 1000;

const registerUser = async (email, password, firstName, lastName) => {
    if (!email || !password) {
        const error = new Error("Email and password are required.");
        error.statusCode = 400;
        throw error;
    }

    if (!firstName && !lastName) {
        const error = new Error("First name and last name are required!");
        error.statusCode = 400;
        throw error;
    }

    if (password) {
        validatePassword(password);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        const error = new Error("Email already registered.");
        error.statusCode = 400;
        throw error;

    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword, firstName, lastName },

    })

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};


const loginUser = async (email, password, rememberMe = false) => {
    if (!email || !password) {
        const error = new Error("Email and password are required.");
        error.statusCode = 400;
        throw error;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error("Invalid credentials.");
        error.statusCode = 401;
        throw error;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        const error = new Error("Invalid credentials.");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    let rawRefreshToken = null;

    if (rememberMe) {
        rawRefreshToken = generateSecureRandomToken();
        const hashedRefreshToken = await hashToken(rawRefreshToken);

        await prisma.refreshToken.create({
            data: {
                token: hashedRefreshToken,
                userId: user.userId,
                expiresAt: new Date(Date.now() + REFRESH_EXPIRY_MS)
            }
        });
    }

    const { password: _, ...safeUser } = user;

    return { accessToken, refreshToken: rawRefreshToken, user: safeUser };

};


const rotateRefreshToken = async (rawToken) => {
    if (!rawToken) {
        const error = new Error("No refresh token provided.");
        error.statusCode = 400;
        throw error;
    }

    const hashedToken = await hashToken(rawToken);
    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: hashedToken }
    });

    if (!storedToken || storedToken.revoked) {
        const error = new Error("Invalid refresh token.");
        error.statusCode = 403;
        throw error;
    }

    if (storedToken.expiresAt < new Date()) {
        await prisma.refreshToken.update({
            where: { refreshTokenId: storedToken.refreshTokenId },
            data: { revoked: true }
        })
        const error = new Error("Refresh token expired. Please log in again.");
        error.statusCode = 403;
        throw error;
    }

    const newRawToken = generateSecureRandomToken();
    const newHashedToken = await hashToken(newRawToken);
    await prisma.refreshToken.update({
        where: { refreshTokenId: storedToken.refreshTokenId },
        data: {
            token: newHashedToken,
            userId: storedToken.userId,
            expiresAt: new Date(Date.now() + REFRESH_EXPIRY_MS),
            revoked: false

        },
    })


    const user = await prisma.user.findUnique({ where: { userId: storedToken.userId } })

    const newAccessToken = jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return { accessToken: newAccessToken, refreshToken: newRawToken, userId: storedToken.userId };

}


const revokeRefreshToken = async (rawToken) => {
    if (!rawToken) return;
    const hashedToken = await hashToken(rawToken);

    await prisma.refreshToken.updateMany({
        where: { token: hashedToken, revoked: false },
        data: { revoked: true }
    })
}


module.exports = { registerUser, loginUser, rotateRefreshToken, revokeRefreshToken };