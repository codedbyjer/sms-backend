const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');
const studentRoutes = require('./routes/studentRoutes')
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/', (req, res) => {
    res.json({ message: "Welcome to Student Management Sytem API!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.use(errorHandler);


module.exports = app;