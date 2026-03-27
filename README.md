# Smart India Hackathon: Crowdsourced Civic Issue Reporting and Resolution System

## 1. Complete Project Architecture
**Mobile-First Web Application**
- **Frontend (Client):** React.js with Tailwind CSS, context API/Zustand for state management, PWA capabilities for mobile-first experience.
- **Backend (Server):** Node.js with Express.js acting as a REST API layer.
- **Database:** MongoDB (via Mongoose) for structured data (users, issues, roles).
- **Storage:** Firebase Cloud Storage / AWS S3 for storing user-uploaded photos.
- **AI/ML Layer:** Google Vision API integrated at the Node.js backend to classify uploaded images (pothole, garbage, etc.) and assign initial severity.
- **Map Services:** Google Maps API (Maps JavaScript API for frontend, Geocoding API for backend).
- **Notification Service:** Nodemailer (Email) / Twilio (SMS).

*Architecture Flow:*
Citizen -> React UI -> Node.js API -> MongoDB & Cloud Storage
Node API <-> Google Vision API (for AI classification)
Node API -> Email/SMS triggers on status change

## 2. Folder Structure
```text
civic-issue-system/
├── client/                 # React.js Frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, icons
│   │   ├── components/     # Reusable UI components (Navbar, Button, Modal)
│   │   ├── pages/          # Page components (Login, Dashboard, ReportIssue, MapView)
│   │   ├── context/        # State management (AuthContext, IssueContext)
│   │   ├── hooks/          # Custom React hooks (useGeolocation, useAuth)
│   │   ├── services/       # API call wrappers (axios instances)
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main routing component
│   │   └── index.css       # Tailwind entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js + Express Backend
│   ├── config/             # DB connection, API keys
│   ├── controllers/        # Request handlers (auth, issues, admin)
│   ├── middlewares/        # Auth verify, file upload (Multer), error handling
│   ├── models/             # Mongoose schemas (User, Issue)
│   ├── routes/             # API route definitions
│   ├── services/           # External API logic (Google Vision, Maps, Email)
│   ├── utils/              # AI classification logic helpers
│   ├── server.js           # Entry point
│   └── package.json
└── README.md
```

## 3. Database Schema (MongoDB)

**User Model (`users` collection)**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  role: String, // 'citizen' | 'admin' | 'authority'
  department: String, // e.g., 'water', 'roads' (null for citizens)
  reputationPoints: Number, // Gamification element
  createdAt: Date
}
```

**Issue Model (`issues` collection)**
```javascript
{
  _id: ObjectId,
  reporterId: { type: ObjectId, ref: 'User' },
  title: String,
  description: String,
  category: String, // 'pothole', 'garbage', 'water_leakage', 'streetlight'
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  address: String,
  photoUrl: String,
  status: String, // 'Pending', 'In Progress', 'Resolved', 'Escalated'
  assignedTo: { type: ObjectId, ref: 'User' }, // Assigned authority
  priority: String, // 'Low', 'Medium', 'High', 'Critical'
  upvotes: [{ type: ObjectId, ref: 'User' }],
  aiClassification: {
    detectedCategory: String,
    confidenceScore: Number,
    isDuplicate: Boolean,
    duplicateOf: { type: ObjectId, ref: 'Issue' }
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 4. API Endpoints

### Authentication
- `POST /api/auth/register` - Register new citizen
- `POST /api/auth/login` - Authenticate user & return JWT

### Citizen Complaints
- `POST /api/issues` - Submit a new issue (Multipart form for image + data)
- `GET /api/issues` - Get public issues (with filtering by category/location)
- `GET /api/issues/me` - Get current user's issues
- `GET /api/issues/:id` - Get specific issue details
- `PUT /api/issues/:id/upvote` - Toggle upvote on an issue

### Admin/Authority Dashboard
- `GET /api/admin/issues` - Get all issues for dashboard (filtering, sorting)
- `PUT /api/admin/issues/:id/status` - Update issue status (triggers notification)
- `PUT /api/admin/issues/:id/assign` - Assign to specific department/authority
- `GET /api/admin/analytics` - Get stats aggregation (issues per category, resolution time)

## 5. UI Wireframes (Conceptual)

- **Landing Page:** Hero section with "Report an Issue" button. Live statistics (Total resolved: 10,000+).
- **Report Issue Screen (Mobile First):**
  - Step 1: "Take Photo" (opens camera) or Upload Gallery.
  - Step 2: Auto-fetch GPS + Map Pin adjustment.
  - Step 3: AI suggests category. User confirms/edits description. Submit.
- **Citizen Dashboard:** List of "My Reports" with visual progress bars (Pending -> Progress -> Resolved). Tab for "Issues near me".
- **Map View:** Google Map showing cluster markers. Red = Pending, Yellow = Progress, Green = Resolved.
- **Admin Dashboard (Desktop):**
  - Left Sidebar: Navigation (Map, Datatable, Analytics, Departments).
  - Main Area: Data table of issues with Quick Actions (Assign, Change Status).
  - Analytics: Pie charts for Issue Categories, Bar charts for Resolution Times.

## 6. Sample Code Snippets (Included in Project Folders)
- `server/controllers/issueController.js` (AI Classification Logic)
- `server/models/Issue.js` (Mongoose Model)
- `client/src/components/ReportMap.jsx` (Google Maps Component)

## 7. Deployment Steps

1. **Prerequisites & API Setup:**
   - Create a Google Cloud project. Enable Maps JavaScript API, Geocoding API, and Vision API. Get API Keys.
   - Set up Cloudinary or AWS S3 bucket for storing images.
   - Provision a MongoDB cluster on MongoDB Atlas.

2. **Backend Deployment (e.g., Render or Heroku):**
   - Connect GitHub repository to Render.
   - Create a new "Web Service" pointing to the `server/` directory.
   - Add environment variables (`MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLOUD_CREDENTIALS` etc.).
   - Deploy backend and grab the public API URL.

3. **Frontend Deployment (e.g., Vercel or Netlify):**
   - In `client/`, set `.env` variable `REACT_APP_API_URL` to point to the deployed backend URL.
   - Connect Vercel to the GitHub repo, selecting the `client/` root folder.
   - Vercel will auto-detect React (Vite/CRA) and build the project.
   - Configure custom domain if necessary.

4. **Post-Deployment:**
   - Create a master Admin account via direct DB entry.
   - Test end-to-end Issue reporting -> AI tagging -> Admin status update -> Email notification.
