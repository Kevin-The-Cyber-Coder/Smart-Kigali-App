const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. MongoDB is installed (https://www.mongodb.com/try/download/community)');
    console.error('   2. MongoDB service is running');
    console.error('   3. The connection string is correct in .env file');
    process.exit(1);
  }
};

module.exports = connectDB;