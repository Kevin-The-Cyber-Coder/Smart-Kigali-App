const dotenv = require('dotenv');
const path = require('path');

// Try multiple ways to load .env
const envPath = path.join(__dirname, '.env');
console.log('Looking for .env at:', envPath);

// Check if file exists
const fs = require('fs');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found!');
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error('Error loading .env:', result.error);
  } else {
    console.log('✅ .env loaded successfully');
  }
} else {
  console.error('❌ .env file NOT found at:', envPath);
  console.log('\nPlease create .env file with:');
  console.log('MONGODB_URI=mongodb+srv://kevine:kevine123@cluster2.mongodb.net/smart_city_db?retryWrites=true&w=majority');
  process.exit(1);
}

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not defined');
  console.log('Current environment variables:', Object.keys(process.env));
  console.log('\nPlease check your .env file content');
  process.exit(1);
}

const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

console.log('\n=================================');
console.log('🚀 SMART CITY BACKEND');
console.log('=================================');
console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔌 Port: ${PORT}`);
console.log(`📊 MongoDB URI: ${process.env.MONGODB_URI.replace(/kevine:.*@/, 'kevine:****@')}`);
console.log('=================================\n');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('✅ MongoDB Atlas connected successfully!');
  console.log(`📁 Database: ${mongoose.connection.name}`);
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log('\n=================================');
    console.log('✨ Server is running!');
    console.log('=================================\n');
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});