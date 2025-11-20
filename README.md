# Gaudani Parivar Student Result Upload System

A modern web application built with React, Vite, Node.js, and MongoDB for the "Gaudani Parivar" (Gaudani Family) community.

## Features

- **Result Upload**: Public users can upload student results with medium selection (Gujarati/English)
- **View Results**: Public viewing of all submitted results with filtering options
- **Top 3 Ranking**: View top 3 students by standard/degree
- **Admin Panel**: Comprehensive admin panel for managing villages, standards, and viewing reports
- **Multi-language Support**: Gujarati (default) and English with easy language switching
- **Export Functionality**: Export reports to PDF, Excel, and DOCX formats

## Technology Stack

### Frontend
- React 18+
- Vite
- TypeScript
- React Router
- React Hook Form
- Axios

### Backend
- Node.js 18+
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gaudani
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**

   Create `backend/.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gaudani_parivar
   NODE_ENV=development
   UPLOAD_DIR=./uploads/results
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,application/pdf
   CORS_ORIGIN=http://localhost:5173
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   ```

   Create `frontend/.env`:
   ```
   VITE_API_BASE_URL=http://localhost:5010/api
   ```

5. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5010

## Default Admin Credentials

If no admin users exist in the database, a default admin user is automatically created:

- **Email:** bhavesh@gmail.com
- **Password:** Bhavesh@123_

⚠️ **Important:** Change the default password after first login!

## Project Structure

```
gaudani/
├── backend/          # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── app.ts
│   └── package.json
│
└── frontend/         # React + Vite frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   ├── i18n/
    │   └── App.tsx
    └── package.json
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

ISC

