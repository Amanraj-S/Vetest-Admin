# Vtest Admin CMS

Smart Vehicle Inspection & Compliance Platform - B2B Administrative CMS & Content API Engine.

## Stack Overview
- **Frontend**: React.js (v18) + JavaScript (JSX) + Vite + Tailwind CSS + Lucide React + Axios + React Hook Form + Zod
- **Backend**: Node.js + Express.js (CommonJS)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT Token-based Auth with bcryptjs password hashing

## Project Structure
```
vtest-admin/
├── frontend/             # React Vite Application
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env              # Contains MongoDB Atlas URI
│
├── uploads/              # Local media storage directory
├── package.json          # Workspace root runner
└── README.md
```

## Default Development Admin Credentials
- **Email**: `admin@vtest.local`
- **Password**: `ChangeMe123!`

## Running the Application

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Seed Initial Database Content
```bash
npm run seed
```

### 3. Start Development Servers (Backend on Port 5000, Frontend on Port 5173)
```bash
npm run dev
```

Or run separately:
- Backend: `npm run dev:backend`
- Frontend: `npm run dev:frontend`
