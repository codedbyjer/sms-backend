const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');
const studentRoutes = require('./routes/studentRoutes')
const cookieParser = require('cookie-parser');

const app = express();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many attempts. Please try again later."
    },

    standardHeaders: true,
    legacyHeaders: false

});

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ message: "Welcome to Student Management Sytem API!" });
});

app.use('/auth', authLimiter, authRoutes);
app.use('/students', studentRoutes);

app.use(errorHandler);


module.exports = app;