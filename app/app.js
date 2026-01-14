require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./config/database');
const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// Test Database Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    }
    console.log('✅ Database connected successfully!');
    connection.release();
});

// Routes
app.use('/', indexRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).send('<h1>404 - Page Not Found</h1>');
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Library Management System - Kelompok F7`);
});
