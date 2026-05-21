// MongoDB Schema for Report (already defined in backend/models/Report.js)
// This is a reference file for database documentation

const reportSchemaDefinition = {
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['roads', 'drainage', 'electricity', 'water', 'waste', 'other'],
    required: true 
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: String,
    district: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium' 
  },
  reportedBy: { type: 'ObjectId', ref: 'User', required: true },
  assignedTo: { type: 'ObjectId', ref: 'User' },
  resolvedAt: Date,
  createdAt: { type: Date, default: Date.now }
};

// Geospatial index for location-based queries
const reportIndexes = [
  { 'location': '2dsphere' },
  { status: 1, createdAt: -1 },
  { category: 1, status: 1 },
  { reportedBy: 1, createdAt: -1 }
];