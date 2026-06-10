const express = require('express');
const cookieParser = require ('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes.js');
const sendMessage = require('./routes/sendMessage.routes.js');
const createProject = require('./routes/createProject.routes.js');
const orderStatus = require('./routes/orderStatus.routes.js');
const feedback = require('./routes/feedback.routes.js');
const customerCare = require('./routes/customerCare.routes.js');
const otpRoutes = require('./routes/otp.routes.js');
require("dotenv").config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/auth', otpRoutes);
app.use('/api/sendMessage', sendMessage);
app.use('/api/createProject', createProject);
app.use('/api/orderStatus', orderStatus);
app.use('/api/feedback', feedback);
app.use('/api/customerCare', customerCare);

module.exports = app;