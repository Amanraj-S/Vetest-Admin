const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const industryRoutes = require('./routes/industryRoutes');
const technologyRoutes = require('./routes/technologyRoutes');
const projectRoutes = require('./routes/projectRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const pageRoutes = require('./routes/pageRoutes');
const userRoutes = require('./routes/userRoutes');
const settingRoutes = require('./routes/settingRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();

// Security & Utility Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during local development
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve static uploads
const uploadDir = path.join(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadDir));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Vtest Admin CMS API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Admin & Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/solutions', solutionRoutes);
app.use('/api/admin/industries', industryRoutes);
app.use('/api/admin/technology', technologyRoutes);
app.use('/api/admin/projects', projectRoutes);
app.use('/api/admin/resources', resourceRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/admin/enquiries', enquiryRoutes);
app.use('/api/admin/pages', pageRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/settings', settingRoutes);

// Public website APIs
app.use('/api', publicRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
