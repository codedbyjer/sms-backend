const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const registerUser = async (email, password) => {
    if (!email || !password) {
        const error = new Error("Email and password are required.");
        error.statusCode = 400;
        throw error;
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        const error = new Error("Email already registered.");
        error.statusCode = 400;
        throw error;

    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword },

    })

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};


const loginUser = async (email, password) => {
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

    const token = jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    const { password: _, ...safeUser } = user;

    return { token, safeUser };

};


module.exports = { registerUser, loginUser };