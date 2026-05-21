const mongoose = require('mongoose');
require('dotenv').config();

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_city_db');
    
    // Create indexes
    await mongoose.connection.db.collection('reports').createIndex({ 'location': '2dsphere' });
    await mongoose.connection.db.collection('reports').createIndex({ status: 1, createdAt: -1 });
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    console.log('✅ Database indexes created successfully');
    
    // Create collections if not exist
    const collections = ['users', 'reports', 'comments', 'notifications'];
    for (const collection of collections) {
      const exists = await mongoose.connection.db.listCollections({ name: collection }).hasNext();
      if (!exists) {
        await mongoose.connection.db.createCollection(collection);
        console.log(`✅ Collection created: ${collection}`);
      }
    }
    
    console.log('🎉 Database initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();