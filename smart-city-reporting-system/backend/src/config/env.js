const validateEnv = () => {
  const required = ['JWT_SECRET', 'MONGODB_URI'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (process.env.JWT_SECRET === 'your_super_secret_jwt_key_change_this') {
    console.warn('⚠️  WARNING: Using default JWT_SECRET. Change this in production!');
  }
  
  return {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    mongoUri: process.env.MONGODB_URI,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5000',
  };
};

module.exports = { validateEnv };