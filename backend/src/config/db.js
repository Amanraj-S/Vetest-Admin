const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connect options for Mongoose 8
    const conn = await mongoose.connect(mongoUri, {
      dbName: 'vtest_admin'
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
