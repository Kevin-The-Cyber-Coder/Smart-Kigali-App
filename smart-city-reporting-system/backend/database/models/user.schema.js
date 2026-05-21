// MongoDB Schema for User (already defined in backend/models/User.js)
// This is a reference file for database documentation

const userSchemaDefinition = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'admin', 'worker'], default: 'citizen' },
  phone: String,
  address: {
    street: String,
    city: String,
    district: String,
    pincode: String
  },
  avatar: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
};

// Indexes
const userIndexes = [
  { email: 1 },
  { role: 1 },
  { 'address.district': 1 }
];