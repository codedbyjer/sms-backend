const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await registerUser(email, password);
        res.status(201).json({ message: "User Registered", user });
    } catch (err) {
        next(err);
    }

}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await loginUser(email, password);
        res.json({ message: "Login Successfully", token, user })
    } catch (err) {
        next(err);
    }
};


module.exports = { register, login };