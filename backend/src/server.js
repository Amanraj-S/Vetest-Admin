const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start HTTP Server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Vtest Admin CMS Backend Server Running`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🟢 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
  });
});
