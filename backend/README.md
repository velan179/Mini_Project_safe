# Tourist Safety Web Application - Backend Enhancement Guide

## 📋 Overview

This is an enhanced, production-ready backend for the Tourist Safety Web Application. The system includes comprehensive features for:

- ✅ User Authentication & Authorization
- ✅ Trusted Contact Management (with database persistence and delete functionality)
- ✅ Evidence Capture (photos, videos, audio)
- ✅ Blood Bank & Blood Donor Support
- ✅ Emergency SOS Alerts
- ✅ Community Safety Reports
- ✅ General Safety Alerts

## 🚀 Quick Start

### Prerequisites

Before running the backend, ensure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/tourist-safety

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_1234567890_change_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads
```

### 3. Start MongoDB (if not already running)

**On Windows (if MongoDB is installed as a service):**
```bash
# MongoDB should start automatically or use:
net start MongoDB

# Or use MongoDB Compass for a GUI
```

**On macOS:**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

**Using Docker (Recommended for Development):**
```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

### 4. Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

The backend will be running at: **http://localhost:5000**

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   └── database.js      # MongoDB connection
├── controllers/         # Business logic
│   ├── authController.js
│   ├── trustedContactController.js
│   ├── evidenceController.js
│   ├── bloodDonorController.js
│   ├── bloodBankController.js
│   ├── bloodRequestController.js
│   ├── sosAlertController.js
│   ├── alertController.js
│   └── reportController.js
├── middleware/          # Express middleware
│   ├── auth.js         # JWT authentication
│   ├── errorHandler.js # Error handling
│   ├── fileUpload.js   # File upload configuration
│   └── validation.js   # Request validation
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── TrustedContact.js
│   ├── Evidence.js
│   ├── BloodDonor.js
│   ├── BloodBank.js
│   ├── BloodRequest.js
│   ├── SOSAlert.js
│   ├── Alert.js
│   └── Report.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── trustedContactRoutes.js
│   ├── evidenceRoutes.js
│   ├── bloodDonorRoutes.js
│   ├── bloodBankRoutes.js
│   ├── bloodRequestRoutes.js
│   ├── sosAlertRoutes.js
│   ├── alertRoutes.js
│   └── reportRoutes.js
├── utils/               # Utility functions
│   ├── jwt.js          # JWT operations
│   └── responseHandler.js
├── uploads/             # User uploaded files
│   └── evidence/       # Evidence files storage
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## 🔑 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Trusted Contacts Routes
- `GET /api/contacts` - Get all trusted contacts
- `POST /api/contacts` - Add new trusted contact
- `GET /api/contacts/:id` - Get single contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - **Delete contact** ✅
- `PUT /api/contacts/:id/set-primary` - Set primary contact

### Evidence Routes
- `POST /api/evidence/upload` - Upload evidence (photo/video/audio)
- `GET /api/evidence/user/all` - Get user's evidence
- `GET /api/evidence/public/all` - Get public evidence
- `GET /api/evidence/:id` - Get single evidence
- `DELETE /api/evidence/:id` - Delete evidence
- `PUT /api/evidence/:id/status` - Update evidence status

### Blood Donor Routes
- `POST /api/blood/donors/register` - Register as blood donor
- `GET /api/blood/donors/profile/me` - Get your donor profile
- `GET /api/blood/donors/search` - Search donors by blood group and city
- `GET /api/blood/donors/available/all` - Get available donors
- `PUT /api/blood/donors/availability/update` - Update availability
- `POST /api/blood/donors/donation/record` - Record donation
- `PUT /api/blood/donors/profile/update` - Update donor profile
- `GET /api/blood/donors/stats` - Get donor statistics

### Blood Bank Routes
- `GET /api/blood/banks` - Get all blood banks
- `GET /api/blood/banks/search` - Search blood banks by city
- `GET /api/blood/banks/:id` - Get blood bank details
- `POST /api/blood/banks` - Create blood bank (admin)
- `PUT /api/blood/banks/:id` - Update blood bank
- `PUT /api/blood/banks/:id/inventory` - Update inventory
- `POST /api/blood/banks/:id/review` - Add review
- `DELETE /api/blood/banks/:id` - Delete blood bank

### Blood Request Routes
- `GET /api/blood/requests` - Get all blood requests
- `POST /api/blood/requests` - Create blood request
- `GET /api/blood/requests/user/my-requests` - Get your requests
- `GET /api/blood/requests/:id` - Get request details
- `PUT /api/blood/requests/:id` - Update request
- `POST /api/blood/requests/:id/respond` - Respond to request
- `PUT /api/blood/requests/:id/status` - Update request status
- `DELETE /api/blood/requests/:id` - Delete request
- `GET /api/blood/requests/:id/matching-donors` - Get matching donors
- `GET /api/blood/requests/stats` - Get request statistics

### SOS Alerts Routes
- `GET /api/sos-alerts` - Get all SOS alerts
- `POST /api/sos-alerts` - Create SOS alert
- `GET /api/sos-alerts/user/my-alerts` - Get your alerts
- `GET /api/sos-alerts/:id` - Get alert details
- `PUT /api/sos-alerts/:id/status` - Update alert status
- `POST /api/sos-alerts/:id/respond` - Add respondent
- `DELETE /api/sos-alerts/:id` - Delete alert
- `GET /api/sos-alerts/nearby/search` - Get nearby alerts

### General Alerts Routes
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/active/only` - Get active alerts
- `POST /api/alerts` - Create alert (admin)
- `GET /api/alerts/:id` - Get alert details
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

### Reports Routes
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create report
- `GET /api/reports/user/my-reports` - Get your reports
- `GET /api/reports/:id` - Get report details
- `PUT /api/reports/:id` - Update report
- `PUT /api/reports/:id/status` - Update report status (admin)
- `POST /api/reports/:id/like` - Like report
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/stats` - Get report statistics

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Obtain a token by registering or logging in:

```bash
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123",
  "bloodGroup": "O+"
}
```

## 📝 Key Features

### ✨ Trusted Contacts Management
- **Database Persistence**: All contacts are stored in MongoDB
- **Full CRUD Operations**: Create, Read, Update, Delete contacts
- **Primary Contact**: Set one contact as primary emergency contact
- **Automatic Notifications**: SOS alerts automatically notify trusted contacts

### 📸 Evidence Capture
- **Multiple File Types**: Photos, Videos, Audio support
- **Automatic Metadata**: User ID, timestamp, location stored
- **File Management**: Secure upload and deletion
- **Status Tracking**: Pending, Verified, Rejected status

### 🩸 Blood Bank System
- **Donor Registration**: Register as blood donor with blood group
- **Donor Search**: Find donors by blood group and location
- **Blood Requests**: Create urgent blood requests
- **Inventory Management**: Track blood availability at banks
- **Donor Matching**: Automatic matching of donors to requests

### 🆘 Emergency Features
- **SOS Alerts**: Create emergency alerts with location
- **Live Location**: Include GPS coordinates
- **Contact Notification**: Auto-notify trusted contacts
- **Respondent Tracking**: Track who responds to alerts
- **Public Sharing**: Option to share alerts publicly

### 📊 Safety Reports
- **Anonymous Reporting**: Report safely without revealing identity
- **Community Feedback**: Like and engage with reports
- **Categorization**: Organize by report type and severity
- **Moderation**: Admin approval for critical reports

## 🧪 Testing

### Test Authentication Endpoint
```bash
curl http://localhost:5000

# Expected response:
{
  "success": true,
  "message": "🚀 Tourist Safety Backend is running!",
  "version": "1.0.0",
  "timestamp": "2026-03-16T..."
}
```

### Test Trusted Contacts (Requires Auth Token)
```bash
# First, register and login to get a token
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "password123"
  }'

# Then get contacts with the token
curl http://localhost:5000/api/contacts \
  -H "Authorization: Bearer <your_token>"
```

## 🛠️ Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh admin --eval "db.adminCommand('ping')"

# If using Docker:
docker logs mongodb
```

### Port Already in Use
```bash
# Change the PORT in .env file
PORT=5001
```

### JWT Token Expired
- Tokens expire after 7 days (configurable via JWT_EXPIRE)
- Users need to login again to get a new token

### File Upload Issues
- Check `uploads/evidence` directory exists and is writable
- Verify MAX_FILE_SIZE matches client settings
- Supported formats: JPEG, PNG, GIF, WebP (images), MP4, MPEG, QuickTime, WebM (videos)

## 📚 Frontend Integration

### Using the API Config
```javascript
import { API_ENDPOINTS, getHeaders, apiCall } from "../services/apiConfig.js";

// Fetch contacts with authentication
const response = await fetch(API_ENDPOINTS.CONTACTS_LIST, {
  headers: getHeaders(),
});
```

### Sample Frontend Implementation
See updated frontend pages:
- `TrustedContacts.jsx` - Full CRUD with database persistence
- `BloodRequest.jsx` - Create blood requests
- `Alerts.jsx` - View safety alerts
- `CommunityReports.jsx` - Post and view reports

## 🚀 Deployment

### Prepare for Production
1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Use strong JWT_SECRET
4. Configure ALLOWED_ORIGINS for your domain
5. Set up MongoDB Atlas or managed MongoDB service

### Deploy to Heroku
```bash
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

### Deploy to Railway/Render
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy automatically

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation above
3. Check MongoDB connection settings
4. Verify environment variables

## 📄 License

ISC

---

**Built with ❤️ for Tourist Safety**
