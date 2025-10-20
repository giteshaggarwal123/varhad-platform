const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const { auditLog, cleanOldLogs } = require('./middleware/auditLog');
const sanitizeInput = require('./middleware/sanitize');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization (protect against XSS)
app.use(sanitizeInput);

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Enhanced security headers with Content Security Policy
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny' // Prevent clickjacking
  },
  noSniff: true, // Prevent MIME sniffing
  xssFilter: true // Enable XSS filter
}));

// Rate limiting - prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Audit logging for sensitive operations
app.use(auditLog);

// Route files
const auth = require('./routes/auth');
const clients = require('./routes/clients');
const outreach = require('./routes/outreach');
const hivTests = require('./routes/hivTests');
const prep = require('./routes/prep');
const inventory = require('./routes/inventory');
const followUps = require('./routes/followUps');
const backupRoutes = require('./routes/backup');
const securityRoutes = require('./routes/security');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/clients', clients);
app.use('/api/outreach', outreach);
app.use('/api/hiv-tests', hivTests);
app.use('/api/prep', prep);
app.use('/api/inventory', inventory);
app.use('/api/followups', followUps);
app.use('/api/backup', backupRoutes);
app.use('/api/security', securityRoutes);

// Initialize backup system
const backup = require('./utils/backup');

// Schedule automatic backups every 24 hours
if (process.env.NODE_ENV === 'production') {
  backup.scheduleBackups(24);
  console.log('[SECURITY] Automatic database backups enabled (every 24 hours)'.green);
}

// Clean old audit logs on startup (keep 90 days)
cleanOldLogs(90);
console.log('[SECURITY] Audit log retention: 90 days'.green);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VARHAD PrEPARED API is running',
    timestamp: new Date().toISOString(),
    security: {
      encryption: 'AES-256-CBC',
      rateLimit: 'Enabled',
      backup: process.env.NODE_ENV === 'production' ? 'Enabled' : 'Disabled',
      helmet: 'Enabled'
    }
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});

module.exports = app;
