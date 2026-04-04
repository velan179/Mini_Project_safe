# Frontend Integration Guide

## 📋 Overview

This guide explains how to use the updated backend API endpoints in your React frontend application. All frontend pages have been updated to work with the new database-persisted backend.

## 🔧 API Configuration

The frontend has a centralized API configuration file that handles all API calls:

**Location**: `frontend/src/services/apiConfig.js`

This file provides:
- Centralized API endpoints
- Automatic authentication token handling
- Consistent error handling
- Response formatting

## 📝 Key Changes from Old to New

### 1. Trusted Contacts (MOST IMPORTANT - NOW WITH DELETE!)

**Old Implementation** (In-memory):
```javascript
- Get contacts: Simple array
- Add contact: Just add to array
- Delete: Array filter (no database persistence)
```

**New Implementation** (Database-Backed):
```javascript
// Get contacts
GET /api/contacts

// Add contact
POST /api/contacts
{
  "name": "Mom",
  "phone": "+91-98765-43210",
  "email": "mom@example.com",
  "relationship": "Family",
  "isPrimary": false
}

// Delete contact (NOW WORKS PROPERLY!)
DELETE /api/contacts/:id

// Set primary contact
PUT /api/contacts/:id/set-primary
```

**Frontend Changes**:
```javascript
// Old way (no persistence):
const deleteContact = (index) => {
  const updated = contacts.filter((_, i) => i !== index);
  setContacts(updated);
};

// New way (database-backed):
const deleteContact = async (contactId) => {
  const response = await fetch(`/api/contacts/${contactId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  // Backend confirms deletion from database
  setContacts((prev) => prev.filter((c) => c._id !== contactId));
};
```

### 2. Blood Requests

**Old Implementation**:
```javascript
POST /api/blood/request
{
  "name": "name",
  "bloodGroup": "group",
  "location": "location",
  "phone": "phone"
}
```

**New Implementation**:
```javascript
POST /api/blood/requests
{
  "patientName": "John Doe",
  "bloodGroup": "O+",
  "unitsNeeded": 2,
  "hospital": "City Hospital",
  "phone": "+1234567890",
  "urgency": "critical",
  "reason": "Surgery required",
  "location": {
    "latitude": 28.7041,
    "longitude": 77.1025,
    "city": "Delhi"
  },
  "neededBy": "2026-03-16T15:30:00"
}
```

### 3. Alerts

**New Features**:
```javascript
// Fetch alerts with filters
GET /api/alerts?type=safety-warning&status=active&severity=high

// Alerts now include:
- timestamp (when created)
- status (active/resolved)
- severity levels
- descriptions
- exact locations
```

### 4. Reports

**Enhanced with Database**:
```javascript
// Create report with all details
POST /api/reports
{
  "title": "Unsafe area warning",
  "description": "Detailed description...",
  "reportType": "safety-concern", // or incident, scam-alert, missing-person, other
  "severity": "high", // low, medium, high
  "isAnonymous": true,
  "location": {
    "latitude": 28.7041,
    "longitude": 77.1025,
    "city": "Delhi"
  }
}

// Enhanced response
{
  "success": true,
  "data": {
    "_id": "mongo-id",
    "title": "...",
    "likes": 0,
    "reportedAt": "2026-03-16T...",
    "status": "pending", // pending, verified, resolved, rejected
    "userId": { firstName: "...", lastName: "..." }
  }
}
```

## 🔐 Authentication Implementation

### Registration
```javascript
const response = await fetch(API_ENDPOINTS.AUTH_REGISTER, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    password: "SecurePassword123",
    bloodGroup: "O+"
  }),
});

const data = await response.json();
if (data.success) {
  // Save token
  localStorage.setItem("token", data.data.token);
  // Save user data
  localStorage.setItem("user", JSON.stringify(data.data.user));
}
```

### Login
```javascript
const response = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    password: "SecurePassword123"
  }),
});

const data = await response.json();
// Save token and user data as above
```

### Using Token in Requests
```javascript
import { getHeaders } from "../services/apiConfig.js";

const response = await fetch(API_ENDPOINTS.CONTACTS_LIST, {
  headers: getHeaders(), // Automatically includes Authorization header
});
```

## 📁 Updated Frontend Files

### 1. **TrustedContacts.jsx**
- ✅ Fetches contacts from database
- ✅ Adds contacts to database
- ✅ **Deletes contacts from database** 
- ✅ Sets primary contact
- ✅ Error handling
- ✅ Loading states
- ✅ Success messages

### 2. **BloodRequest.jsx**
- ✅ Complete form with all required fields
- ✅ Blood group selection
- ✅ Urgency levels
- ✅ Date/time picker
- ✅ Location support
- ✅ Error messages
- ✅ Form validation

### 3. **Alerts.jsx**
- ✅ Fetches alerts from backend
- ✅ Displays severity badges
- ✅ Shows status
- ✅ Formatted timestamps
- ✅ Location information
- ✅ Loading state

### 4. **CommunityReports.jsx**
- ✅ Create reports with title and description
- ✅ Select report type
- ✅ Set severity level
- ✅ Anonymous posting option
- ✅ Like reports
- ✅ Delete own reports
- ✅ Display reports from all users

## 🎯 How to Use Updated Components

### Example 1: Use TrustedContacts
```javascript
import TrustedContacts from "./pages/TrustedContacts";

function App() {
  return <TrustedContacts />;
}
```

The component will:
1. Fetch all contacts from backend on mount
2. Display them in a beautiful card layout
3. Allow adding new contacts
4. **Allow deleting contacts properly** (now persisted in DB)
5. Allow setting primary contact
6. Show success/error messages

### Example 2: Create Blood Request
```javascript
import BloodRequest from "./pages/BloodRequest";

// User fills form → Data sent to backend
// Backend stores in MongoDB
// Matching donors are notified
```

### Example 3: View Alerts
```javascript
import Alerts from "./pages/Alerts";

// Fetches from /api/alerts
// Shows severity color-coded
// Displays real-time status
```

## 💾 Data Persistence

All data is now stored in MongoDB:

```
MongoDB Database Structure
│
├── users
│   ├── firstName, lastName
│   ├── email, phone
│   ├── passwordHash
│   └── bloodGroup
│
├── trustedcontacts (✨ NOW DELETABLE!)
│   ├── userId
│   ├── name, phone, email
│   ├── relationship
│   └── isPrimary
│
├── evidence
│   ├── userId
│   ├── filePath, fileSize
│   ├── type (photo/video/audio)
│   └── metadata
│
├── blooddonors
│   ├── userId
│   ├── bloodGroup, city
│   ├── isAvailable
│   └── donationHistory
│
├── bloodbanks
│   ├── name, location
│   ├── phone, email
│   └── inventory
│
├── bloodrequests
│   ├── userId
│   ├── bloodGroup, unitsNeeded
│   ├── hospital, urgency
│   └── responses
│
├── sosalerts
│   ├── userId
│   ├── location, alertType
│   ├── contacts (to notify)
│   └── respondents
│
├── alerts
│   ├── title, description
│   ├── severity, type
│   └── status
│
└── reports
    ├── userId
    ├── title, description
    ├── reportType, severity
    ├── isAnonymous
    └── likes
```

## 🔄 API Response Format

All API responses follow consistent format:

### Success Response
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    // If applicable
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Error Response
```javascript
{
  "success": false,
  "message": "Error description"
}
```

## ⚠️ Common Integration Issues

### 1. "Authorization denied" Error
```javascript
// Ensure token is saved after login
localStorage.setItem("token", data.data.token);

// getHeaders() will now include it
```

### 2. "Contact not found" After Delete
```javascript
// Old way (incorrect):
deleteContact(index); // Uses array index

// New way (correct):
deleteContact(contact._id); // Uses MongoDB ID
```

### 3. CORS Errors
```javascript
// Add your frontend URL to backend .env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. File Upload Issues
```javascript
// For evidence uploads, use FormData
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("type", "photo");

const response = await fetch(API_ENDPOINTS.EVIDENCE_UPLOAD, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${getAuthToken()}`
    // Note: Don't set Content-Type, let browser set it
  },
  body: formData
});
```

## 🧪 Testing Workflow

1. **Register User**
   - POST /api/auth/register
   - Save returned token

2. **Add Trusted Contact**
   - POST /api/contacts with token
   - Verify contact appears in DB

3. **Delete Trusted Contact** ✨
   - DELETE /api/contacts/:id with token
   - Contact is permanently removed from DB

4. **Create Blood Request**
   - POST /api/blood/requests with all details
   - Nearby donors notified

5. **Post Safety Report**
   - POST /api/reports with report details
   - Community can like and view

## 📱 Mobile Considerations

The APIs support mobile-specific features:

```javascript
// Get user's current location
navigator.geolocation.getCurrentPosition((position) => {
  const location = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    city: "Detected Location"
  };
  
  // Use in API calls
  createSOSAlert({
    location,
    alertType: "medical-emergency",
    // ...
  });
});
```

## 🚀 Next Steps

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Start MongoDB** (using Docker recommended)
   ```bash
   docker run -d -p 27017:27017 mongo:latest
   ```

3. **Configure .env** in backend directory

4. **Start backend**
   ```bash
   npm start
   ```

5. **Update frontend .env** if needed

6. **Test API endpoints** using Postman or curl

7. **Deploy** to production when ready

---

**All features are now fully functional with persistent database storage!** 🎉
