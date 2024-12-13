const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authMiddleware = require('./middleware/authMiddleware'); // Existing authentication middleware
const cors = require('cors');

// Allow all origins or specific domains
const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-frontend-domain.com'], // Replace with actual frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); // Apply CORS middleware globally

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Health Check Route
app.get('/', (req, res) => {
    res.send('OceanMart backend is running!');
});

// Import Existing Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes'); // Adjust the path as needed
const publicProductRoutes = require('./routes/publicprRoutes');

// Import New OTP Routes
const authOtpRoutes = require('./routes/authOtp');

// Mount Routes
app.use('/api/auth', authRoutes); // Existing auth routes
app.use('/api/auth/otp', authOtpRoutes); // New OTP-based auth routes
app.use('/api/prod/all', publicProductRoutes); // Unprotected product routes

// Apply Authentication Middleware Globally
app.use(authMiddleware);

// Protected Routes
app.use('/api/users', userRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/products', require('./routes/products'));

// Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
