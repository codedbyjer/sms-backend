const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const registerUser = async (email, password) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already exist");

    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
        data: { email, password: hashedPassword },

    })
};


const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid Password!");

    const token = jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { token, user };

};


module.exports = { registerUser, loginUser };