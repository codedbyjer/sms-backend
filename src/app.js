const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');
const protectedRoutes = require('./routes/protectedRoutes');
const studentRoutes = require('./routes/studentRoutes')

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

app.use('/api/students', studentRoutes);

app.use('/api/', protectedRoutes);

app.use(errorHandler);


module.exports = app;