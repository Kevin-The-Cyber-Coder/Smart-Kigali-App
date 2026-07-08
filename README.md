# Smart City Reporting System Documentation

## 🏙️ Overview
The Smart City Reporting System is a comprehensive platform that allows citizens to report civic issues, track their resolution status, and engage with municipal authorities in real-time.

## 🚀 Features

### For Citizens
- Report issues with location, photos, and descriptions
- Track report status in real-time
- Receive notifications about updates
- View nearby reported issues
- Comment on reports

### For Administrators
- Manage all reports
- Assign issues to workers
- Generate analytics reports
- Monitor response times
- Export data for analysis

### For Workers
- View assigned reports
- Update issue status
- Add comments and resolution notes
- Upload completion proofs

## 🛠️ Technology Stack

### Frontend
- **Framework:** Vue.js 3
- **State Management:** Pinia
- **Routing:** Vue Router
- **Styling:** CSS3 with Inter Font
- **Icons:** Font Awesome 6
- **Maps:** Leaflet
- **Charts:** Chart.js
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **File Upload:** Multer
- **Email:** Nodemailer

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev

Frontend Setup
bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
Database Setup
bash
# Start MongoDB
mongod --dbpath ./data

# Seed database (optional)
cd database
node seeds/users.seed.js
node seeds/reports.seed.js
📁 Project Structure
text
smart-city-reporting-system/
├── frontend/          # Vue.js frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── views/        # Page components
│   │   ├── store/        # Pinia stores
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
├── backend/           # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Custom middleware
└── database/          # Database schemas and seeds
🔌 API Endpoints
Authentication
POST /api/auth/register - Register new user

POST /api/auth/login - Login user

GET /api/auth/profile - Get user profile

PUT /api/auth/profile - Update profile

Reports
GET /api/reports - Get all reports

POST /api/reports - Create new report

GET /api/reports/:id - Get report by ID

PUT /api/reports/:id/status - Update report status

POST /api/reports/:id/comments - Add comment

GET /api/reports/nearby - Get nearby reports

Admin
GET /api/admin/users - Get all users

PUT /api/admin/users/:id - Update user role

DELETE /api/admin/users/:id - Delete user

GET /api/admin/analytics - Get system analytics

🎨 Styling Guidelines
Fonts
Primary font: Inter (Google Fonts)

Fallback: system-ui, -apple-system, sans-serif

Icons
Font Awesome 6 (Free tier)

Usage: <i class="fas fa-icon-name"></i>

Color Scheme
Primary Gradient: #667eea to #764ba2

Success: #10b981

Warning: #f59e0b

Danger: #ef4444

Info: #3b82f6

🚀 Deployment
Build for Production
bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
Environment Variables
Backend (.env)

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart_city_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
Frontend (.env)

env
VITE_API_URL=http://localhost:5000/api
VITE_MAP_TOKEN=your_map_token
🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open Pull Request

📄 License
MIT License - see LICENSE file for details

📞 Support
Email: mukeshimanakevin20@gmail.com

Issues: github.com/Kevin-The-Cyber-Coder/Smart-Kigali-App
