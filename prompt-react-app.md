# Gaudani Parivar Student Result Upload System - React Application

## Project Overview
A modern web application built with React, Vite, Node.js, and MongoDB for the "Gaudani Parivar" (Gaudani Family) community. This application allows public users to upload student results with required details. The system includes a comprehensive admin panel for managing villages, standards, and viewing reports. The application supports multiple languages with Gujarati as the default language and English as an alternative.

**Project Title:** ગૌદાની પરિવાર | જય ખોડીયાર માં (Gaudani Parivar | Jay Khodiyar Ma)

**Language Support:** 
- **Default Language:** Gujarati (ગુજરાતી)
- **Secondary Language:** English
- **Extensible:** System designed to easily add more languages in the future
- **Language Switcher:** Users can switch between languages at any time
- **Persistent:** Selected language preference is saved in localStorage

## Key Features

### Public Features
1. **Result Upload:** Users can upload student results with medium selection (Gujarati/English)
2. **View Results:** Public viewing of all submitted results with filtering options
3. **Medium-based Filtering:** Filter results by Gujarati or English medium
4. **Search & Filter:** Search by student name, filter by standard, village, and medium
5. **Top 3 Ranking:** View top 3 students by standard/degree
6. **Print Functionality:** Print results and reports
7. **Contact Information:** Store and display student contact numbers

### Admin Features
1. **Village Management:** Add, edit, delete, and manage village names
2. **Standard Management:** Add, edit, delete, and manage school standards and college degrees
3. **Report Generation:** Comprehensive reports separated by medium (Gujarati/English)
4. **Statistics Dashboard:** Overview of all results with charts and graphs
5. **Export Functionality:** Export reports to PDF, Excel, and DOCX formats
6. **Result Management:** View, update, and delete results
7. **Awards/Recognition Lists:** Generate First Rank and Second Rank student lists for awards
8. **Print Functionality:** Print results, reports, and college-specific results

### Technical Features
1. **Medium Selection:** Users select medium (Gujarati/English) during upload
2. **Separate Reports:** Reports are generated separately for Gujarati and English medium
3. **Multi-language Support:** Entire interface supports Gujarati and English with easy extensibility
4. **Language Switcher:** Users can switch languages dynamically
5. **Admin Authentication:** Secure admin panel with JWT authentication
6. **CRUD Operations:** Full create, read, update, delete for villages and standards

## Technology Stack

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Language:** TypeScript (recommended) or JavaScript
- **Styling:** CSS Modules / Tailwind CSS / Styled Components
- **Form Handling:** React Hook Form
- **HTTP Client:** Axios
- **State Management:** React Context API or Zustand (if needed)
- **Internationalization:** React Context API for i18n (custom solution) or react-i18next
- **Image Upload:** File upload with preview
- **Gujarati Support:** Google Transliteration API or similar

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** JavaScript (ES6 Modules)
- **Database:** MongoDB with Mongoose ODM
- **File Upload:** Multer (for image handling)
- **Validation:** Joi or Zod
- **CORS:** Enabled for frontend communication

### Database
- **Database:** MongoDB
- **ODM:** Mongoose

## Project Structure

```
gaudani-result-upload/
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.module.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Input/
│   │   │   │   ├── Select/
│   │   │   │   ├── FileUpload/
│   │   │   │   ├── LoadingSpinner/
│   │   │   │   └── LanguageSwitcher/
│   │   │   │       ├── LanguageSwitcher.tsx
│   │   │   │       ├── LanguageSwitcher.module.css
│   │   │   │       └── index.ts
│   │   │   ├── layout/
│   │   │   │   ├── Header/
│   │   │   │   ├── Footer/
│   │   │   │   └── Layout.tsx
│   │   │   └── forms/
│   │   │       └── ResultUploadForm/
│   │   ├── pages/
│   │   │   ├── HomePage/
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── HomePage.module.css
│   │   │   │   └── index.ts
│   │   │   ├── UploadResultPage/
│   │   │   │   ├── UploadResultPage.tsx
│   │   │   │   ├── UploadResultPage.module.css
│   │   │   │   └── index.ts
│   │   │   ├── ViewResultsPage/
│   │   │   │   ├── ViewResultsPage.tsx
│   │   │   │   ├── ViewResultsPage.module.css
│   │   │   │   └── index.ts
│   │   │   ├── TopThreeRankingPage/
│   │   │   │   ├── TopThreeRankingPage.tsx
│   │   │   │   ├── TopThreeRankingPage.module.css
│   │   │   │   └── index.ts
│   │   │   ├── EventInformationPage/
│   │   │   │   ├── EventInformationPage.tsx
│   │   │   │   ├── EventInformationPage.module.css
│   │   │   │   └── index.ts
│   │   │   ├── admin/
│   │   │   │   ├── AdminLoginPage/
│   │   │   │   │   ├── AdminLoginPage.tsx
│   │   │   │   │   ├── AdminLoginPage.module.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── AdminDashboard/
│   │   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   │   ├── AdminDashboard.module.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── ManageVillages/
│   │   │   │   │   ├── ManageVillages.tsx
│   │   │   │   │   ├── ManageVillages.module.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── ManageStandards/
│   │   │   │   │   ├── ManageStandards.tsx
│   │   │   │   │   ├── ManageStandards.module.css
│   │   │   │   │   └── index.ts
│   │   │   │   └── ViewReports/
│   │   │   │       ├── ViewReports.tsx
│   │   │   │       ├── ViewReports.module.css
│   │   │   │       └── index.ts
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── resultApi.ts
│   │   │   │   ├── villageApi.ts
│   │   │   │   └── standardApi.ts
│   │   │   └── transliteration/
│   │   │       └── gujaratiTransliteration.ts
│   │   ├── hooks/
│   │   │   ├── useFormValidation.ts
│   │   │   ├── useFileUpload.ts
│   │   │   └── useApi.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── validators.ts
│   │   │   └── formatters.ts
│   │   ├── types/
│   │   │   ├── result.types.ts
│   │   │   ├── village.types.ts
│   │   │   └── standard.types.ts
│   │   ├── context/
│   │   │   ├── AppContext.tsx
│   │   │   └── LanguageContext.tsx
│   │   ├── i18n/
│   │   │   ├── languages/
│   │   │   │   ├── gu.json
│   │   │   │   ├── en.json
│   │   │   │   └── index.ts
│   │   │   ├── useTranslation.ts
│   │   │   └── languageConfig.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── public/
│   │   ├── images/
│   │   └── favicon.ico
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env
│
├── backend/                     # Node.js + Express application
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── resultController.js
│   │   │   ├── villageController.js
│   │   │   ├── standardController.js
│   │   │   ├── reportController.js
│   │   │   └── adminController.js
│   │   ├── models/
│   │   │   ├── Result.js
│   │   │   ├── Village.js
│   │   │   ├── Standard.js
│   │   │   └── Admin.js
│   │   ├── routes/
│   │   │   ├── resultRoutes.js
│   │   │   ├── villageRoutes.js
│   │   │   ├── standardRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   └── index.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── validationMiddleware.js
│   │   │   └── authMiddleware.js
│   │   ├── services/
│   │   │   ├── resultService.js
│   │   │   ├── villageService.js
│   │   │   └── standardService.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   └── fileHandler.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── multer.js
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/                 # Uploaded result images
│   │   └── results/
│   ├── .env
│   ├── package.json
│   └── nodemon.json
│
└── README.md
```

## Naming Conventions

### Frontend (React)
- **Components:** PascalCase (e.g., `Button`, `ResultUploadForm`)
- **Files:** PascalCase for components (e.g., `Button.tsx`), camelCase for utilities (e.g., `formatters.ts`)
- **Functions:** camelCase (e.g., `handleSubmit`, `validateForm`)
- **Variables:** camelCase (e.g., `studentName`, `totalMarks`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`, `API_BASE_URL`)
- **CSS Modules:** camelCase (e.g., `buttonContainer`, `formWrapper`)
- **Hooks:** camelCase starting with "use" (e.g., `useFormValidation`, `useFileUpload`)

### Backend (Node.js)
- **Files:** camelCase (e.g., `resultController.js`, `authMiddleware.js`)
- **Classes:** PascalCase (e.g., `Result`, `Village`)
- **Functions:** camelCase (e.g., `createResult`, `validateInput`)
- **Variables:** camelCase (e.g., `studentName`, `totalMarks`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`, `ALLOWED_FILE_TYPES`)
- **Routes:** kebab-case in URLs (e.g., `/api/results`, `/api/villages`)
- **Modules:** ES6 import/export syntax

### Database (MongoDB)
- **Collections:** camelCase, plural (e.g., `results`, `villages`, `standards`)
- **Documents:** camelCase fields (e.g., `studentName`, `totalMarks`, `obtainedMarks`)
- **Indexes:** Descriptive names (e.g., `studentName_1`, `standardId_1`)

## Database Schema (MongoDB)

### 1. Results Collection
```javascript
// Result Schema (Mongoose)
const ResultSchema = {
  _id: ObjectId;
  studentName: string;              // Student full name (Gujarati)
  standardId: ObjectId;             // Reference to Standard
  medium: string;                   // "gujarati" or "english" - Medium of instruction
  totalMarks: number;               // Total marks (optional if percentage is provided directly)
  obtainedMarks: number;            // Marks obtained (optional if percentage is provided directly)
  percentage: number;               // Percentage: either calculated or directly entered
  villageId: ObjectId;              // Reference to Village
  contactNumber: string;             // Contact number (optional, 10 digits)
  resultImageUrl: string;            // Path to uploaded image (optional)
  resultImageFileName: string;       // Original filename (optional)
  submittedAt: Date;                 // Timestamp
  isVerified: boolean;              // Admin verification status (default: false)
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Villages Collection
```javascript
// Village Schema (Mongoose)
const VillageSchema = {
  _id: ObjectId;
  villageName: string;               // Village/family name (Gujarati)
  isActive: boolean;                 // Active status
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Standards Collection
```javascript
// Standard Schema (Mongoose)
const StandardSchema = {
  _id: ObjectId;
  standardName: string;              // Standard/grade name (Gujarati)
  standardCode: string;              // Unique code (e.g., "STD_1", "STD_2")
  displayOrder: number;              // Order for display
  isActive: boolean;                 // Active status
  isCollegeLevel: boolean;           // true for college, false for school
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Admin Users Collection
```javascript
// Admin Schema (Mongoose)
const AdminSchema = {
  _id: ObjectId;
  email: string;                     // Admin email (unique)
  password: string;                   // Hashed password (bcrypt)
  username: string;                   // Admin username (optional)
  fullName: string;                   // Admin full name (optional)
  isActive: boolean;                  // Active status (default: true)
  role: string;                       // Admin role (default: "admin")
  lastLogin: Date;                    // Last login timestamp (optional)
  createdAt: Date;
  updatedAt: Date;
}
```

**Default Admin User:**
- If no admin users exist in the database, the system will automatically create a default admin user:
  - **Email:** bhavesh@gmail.com
  - **Password:** Bhavesh@123_
  - **Username:** bhavesh (optional)
  - **Full Name:** Bhavesh (optional)
  - **Role:** admin
  - **Is Active:** true
- This default admin is created automatically on server startup or first database connection
- Password must be hashed using bcrypt before storage
- After first login, admin should change the default password (recommended)

## Navigation Structure

### Main Navigation Bar
The application includes a consistent navigation bar across all pages with the following links (all in Gujarati):

1. **ગૌદાની પરિવાર** (Gaudani Parivar) - Home page
2. **નવું રિજલ્ટ ઉમેરો** (Add New Result) - Upload result page
3. **ગામ નું નામ ઉમેરો** (Add Village Name) - Manage villages (admin)
4. **વિધાર્થી નું લીસ્ટ** (Student List) - View all results
5. **એક થી ત્રણ નંબર નું લીસ્ટ** (Top 3 List) - Top 3 ranking page
6. **કાર્ય ક્રમની માહિતી** (Event Information) - Event information page
7. **Logout** - Logout (admin only)

### User Information Display
- Right side of navigation: "Hello [Username]...!" (translated based on language)
- Below username: "|| કુળદેવી આઈ શ્રી ખોડીયાર માતાજી ||" (Kuldevi Aai Shree Khodiyar Mataji)
- Language Switcher: Dropdown or button group to switch between Gujarati and English
  - Position: Top right corner of navigation bar
  - Options: "ગુજરાતી" / "English" or language codes "GU" / "EN"
  - Immediate update: All UI elements change language instantly

## Application Flow

### Page 1: Home/Instruction Page
**Route:** `/`
**Component:** `HomePage`

**Features:**
- Welcome message in Gujarati
- Instructions for uploading results
- Large, prominent "Upload Result" button
- Information about the process
- No authentication required

**UI Elements:**
- Header with title: "ગૌદાની પરિવાર | જય ખોડીયાર માં"
- Instruction section with steps
- Call-to-action buttons:
  - "રિજલ્ટ અપલોડ કરો" (Upload Result) - Navigate to upload page
  - "રિજલ્ટ જુઓ" (View Results) - Navigate to view results page
- Footer with contact information (optional)
- All text in Gujarati

### Page 2: Upload Result Page
**Route:** `/upload-result`
**Component:** `UploadResultPage`

**Features:**
- Public access (no authentication)
- Form with required fields
- Image upload with preview
- Real-time validation
- Gujarati transliteration support
- Success/error messages

**Form Fields:**

1. **Student Name (વિધાર્થી નું નામ)**
   - Type: Text input
   - Required: Yes
   - Gujarati transliteration enabled
   - Validation: Min 2 characters, max 100 characters

2. **Medium (માધ્યમ)**
   - Type: Radio buttons or Dropdown
   - Required: Yes
   - Options: 
     - "ગુજરાતી" (Gujarati) - value: "gujarati"
     - "ઇંગ્લિશ" (English) - value: "english"
   - Default: None (user must select)
   - Display: Gujarati labels only

3. **Standard (ધોરણ)**
   - Type: Dropdown/Select
   - Required: Yes
   - Options: Loaded from Standards collection (both school and college levels)
   - Display: Standard name in Gujarati
   - Value: Standard ID
   - Note: Includes both school standards (ધોરણ 1-12) and college degrees (બી.એ., બી.કોમ., એમ.એ., etc.)

4. **Total Marks (કુલ ગુણ)** - Optional
   - Type: Number input
   - Required: No (if percentage is provided directly)
   - Validation: Min 1, Max 10000
   - Step: 1
   - Note: Either provide marks OR percentage directly

5. **Obtained Marks (મેળવેલ ગુણ)** - Optional
   - Type: Number input
   - Required: No (if percentage is provided directly)
   - Validation: Min 0, Max = Total Marks
   - Step: 0.01 (for decimal marks)
   - Real-time validation: Cannot exceed total marks
   - Note: Either provide marks OR percentage directly

6. **Total Percentage (કુલ આવેલ ટકાવારી)** - Alternative to marks
   - Type: Number input
   - Required: Yes (if marks not provided)
   - Validation: Min 0, Max 100
   - Step: 0.01
   - Display: Show percentage with % symbol
   - Note: Can be entered directly OR calculated from marks

7. **Result Image (રિજલ્ટ ની છબી)** - Optional
   - Type: File input (image)
   - Required: No
   - Accepted formats: JPG, JPEG, PNG, PDF
   - Max size: 5MB
   - Preview: Show image preview after selection
   - Validation: File type and size

8. **Village (ગામ પરિવાર)**
   - Type: Dropdown/Select
   - Required: Yes
   - Options: Loaded from Villages collection
   - Display: Village name in Gujarati
   - Value: Village ID

9. **Contact Number (કોન્ટેક નંબર)** - Optional
   - Type: Text input (phone number)
   - Required: No
   - Validation: 10 digits (Indian phone number format)
   - Placeholder: "કોન્ટેક નંબર"
   - Format: Numeric only, 10 digits

**Form Behavior:**
- **Percentage Calculation:** 
  - If marks provided: Percentage calculated automatically: `(obtainedMarks / totalMarks) * 100`
  - If percentage provided directly: Use entered percentage value
  - Display percentage in real-time
- **Input Mode Toggle:** Allow user to choose between:
  - Mode 1: Enter Total Marks + Obtained Marks (percentage auto-calculated)
  - Mode 2: Enter Percentage directly
- Form validation on blur and submit
- Disable submit button while processing
- Show loading state during submission
- Success message with confirmation
- Error messages in Gujarati
- Reset form after successful submission (optional)

**Form Buttons:**
- **Save Button** (Green) - Submit the form
  - Label: "Save" or "સાચવો" (Save in Gujarati)
  - Action: Validate and submit form data
  - Disabled during submission
  - Shows loading state
- **Reset Button** (Red) - Clear all form fields
  - Label: "Reset" or "રીસેટ" (Reset in Gujarati)
  - Action: Clear all input fields and reset form to initial state
  - Confirmation: Optional confirmation dialog

**Submit Action:**
- Upload image to server (if provided)
- Save result data to MongoDB (including medium selection, contact number)
- Show success message
- Option to upload another result
- Redirect to home page after 3 seconds (optional)

### Page 3: View Results Page (Public/Admin)
**Route:** `/view-results` or `/student-list`
**Component:** `ViewResultsPage`

**Features:**
- Public or admin access
- View all submitted results
- Filter by medium (Gujarati/English)
- Filter by standard/degree
- Filter by village
- Search by student name
- Sort by percentage, date, etc.
- Pagination for large result sets
- Display result images
- Inline edit and delete (admin only)
- Print functionality
- Print college results separately
- All UI in Gujarati

**Filter Options:**
- Standard Filter: Dropdown with all standards (વિધાર્થી નું ધોરણ)
- Village Filter: Dropdown with all villages (ગામ પરિવાર)
- Medium Filter (optional): 
  - બધા (All)
  - ગુજરાતી માધ્યમ (Gujarati Medium)
  - ઇંગ્લિશ માધ્યમ (English Medium)
- Search: Student name search

**Action Buttons:**
- **"Search"** (Green button) - Apply filters and search
  - Action: Filter results based on selected standard, village, and search query
- **"print"** (Orange button) - Print current filtered results
  - Action: Open print dialog with formatted results
- **"Print Colleage"** (Red button) - Print only college degree results
  - Action: Filter to show only college-level standards and open print dialog

**Display:**
- Results displayed in table format
- Table Columns:
  - ક્રમ (Sr. No.)
  - વિધાર્થી નું પૂરું નામ (Student Full Name)
  - વિધાર્થી નું ધોરણ (Student Standard)
  - ટકાવારી (Percentage)
  - ગામ પરિવાર (Village Family)
  - કોન્ટેક નંબર (Contact Number)
  - Action (સુધારો કરો || કાઢી નાખો - Edit || Delete)
- Click to view full result image (if available)
- Inline editing: Click "સુધારો કરો" to edit in modal/form
- Delete confirmation: Click "કાઢી નાખો" with confirmation dialog
- Responsive design

### Page 4: Admin Login Page
**Route:** `/admin/login`
**Component:** `AdminLoginPage`

**Features:**
- Admin authentication
- Simple login form
- JWT token generation
- Redirect to admin dashboard after login
- All UI in Gujarati

**Form Fields:**
- **Email (ઇમેઇલ)**
  - Type: Email input
  - Required: Yes
  - Placeholder: "ઇમેઇલ" or "Email"
  - Validation: Valid email format
  - Default admin email: bhavesh@gmail.com (for reference, not pre-filled)
  
- **Password (પાસવર્ડ)**
  - Type: Password input
  - Required: Yes
  - Placeholder: "પાસવર્ડ" or "Password"
  - Default admin password: Bhavesh@123_ (for reference, not pre-filled)

**Form Buttons:**
- **Login Button** (Green) - Submit login credentials
  - Label: "લૉગિન" (Login)
  - Action: Authenticate using email and password, redirect to admin dashboard
- **Cancel/Reset Button** (Red) - Clear form
  - Label: "રદ કરો" (Cancel)
  - Action: Clear input fields

**Behavior:**
- Show error message on invalid credentials
- Store JWT token in localStorage/sessionStorage
- Redirect to `/admin` on successful login
- Show loading state during authentication
- **Default Admin Credentials (if no admin exists):**
  - Email: bhavesh@gmail.com
  - Password: Bhavesh@123_
  - Note: These credentials are automatically created if no admin users exist in the database

### Page 5: Admin Dashboard
**Route:** `/admin`
**Component:** `AdminDashboard`

**Features:**
- Admin authentication required (simple password protection or JWT)
- Overview statistics:
  - Total results count
  - Results by medium (Gujarati/English)
  - Results by standard
  - Results by village
  - Recent submissions
- Quick links to:
  - Manage Villages
  - Manage Standards
  - View Reports
  - View All Results
- All UI in Gujarati

### Page 6: Manage Villages
**Route:** `/admin/manage-villages`
**Component:** `ManageVillages`

**Features:**
- Admin access only
- CRUD operations for villages:
  - **Create:** Add new village name (Gujarati)
  - **Read:** List all villages with status (active/inactive)
  - **Update:** Edit village name and status
  - **Delete:** Soft delete (set isActive to false) or hard delete
- Form fields:
  - Village Name (ગામ/પરિવાર નું નામ) - Text input, Gujarati
  - Active Status (સક્રિય સ્થિતિ) - Checkbox
- Validation:
  - Village name required, 2-100 characters
  - Duplicate name check
- Form Buttons:
  - **Save Button** (Green) - Submit village form
    - Label: "Save" or "સાચવો"
    - Action: Create or update village
  - **Reset Button** (Red) - Clear form
    - Label: "Reset" or "રીસેટ"
    - Action: Clear input fields
- Display:
  - Table/list of all villages
  - Edit and Delete buttons
  - Status indicator
- All UI in Gujarati

### Page 7: Manage Standards
**Route:** `/admin/manage-standards`
**Component:** `ManageStandards`

**Features:**
- Admin access only
- CRUD operations for standards:
  - **Create:** Add new standard/degree (Gujarati)
  - **Read:** List all standards with details
  - **Update:** Edit standard name, code, order, status
  - **Delete:** Soft delete or hard delete
- Form fields:
  - Standard Name (ધોરણ/ડિગ્રી નું નામ) - Text input, Gujarati
  - Standard Code (કોડ) - Text input (e.g., "STD_1", "BCOM", "MA")
  - Display Order (ક્રમ) - Number input
  - Is College Level (કોલેજ સ્તર) - Checkbox
  - Active Status (સક્રિય સ્થિતિ) - Checkbox
- Validation:
  - Standard name required, 2-100 characters
  - Standard code required, unique
  - Display order required, number
- Form Buttons:
  - **Save Button** (Green) - Submit standard form
    - Label: "Save" or "સાચવો"
    - Action: Create or update standard
  - **Reset Button** (Red) - Clear form
    - Label: "Reset" or "રીસેટ"
    - Action: Clear input fields
- Display:
  - Table/list of all standards
  - Grouped by school/college level
  - Edit and Delete buttons
  - Status indicator
  - Sortable by display order
- All UI in Gujarati

**Standard Examples:**
- School: ધોરણ 1, ધોરણ 2, ..., ધોરણ 12
- College: બી.એ., બી.કોમ., બી.એસસી., એમ.એ., એમ.કોમ., etc.

### Page 8: Top 3 Ranking Page
**Route:** `/top-three-ranking`
**Component:** `TopThreeRankingPage`

**Features:**
- Public or admin access
- View top 3 students by standard/degree
- Select standard from dropdown
- Display results grouped by standard
- Download top 3 list as DOCX
- Print functionality
- All UI in Gujarati

**Functionality:**
- Standard Selection: Dropdown to select standard/degree
- Display: Shows top 3 students for selected standard
- Grouped Display: Results shown grouped by standard (e.g., જ.કે.જી, સી.કે.જી, etc.)
- Actions:
  - **"અહી ક્લીક કરો" (Click Here)** (Green button) - Generate/view top 3 for selected standard
    - Action: Fetch and display top 3 students for the selected standard
  - **"View All"** (Orange button) - View all top 3 results across all standards
    - Action: Display top 3 students grouped by all standards
  - **"Download All first 3 Rank Docx"** (Blue button) - Download complete top 3 list as DOCX
    - Action: Generate and download DOCX file with all top 3 rankings
- Table Columns:
  - Sr. No.
  - Student Full Name
  - Student Standard
  - Total Percentage
  - Village Family
  - Contact Number
  - Action (Edit || Delete - admin only)

**Display Format:**
- Empty table at top for "Top 3 List"
- Below: Results grouped by standard
- Each group shows top 3 students for that standard
- Sorted by percentage (descending)

### Page 9: Event Information Page
**Route:** `/event-information`
**Component:** `EventInformationPage`

**Features:**
- Public or admin access
- Display event/program information
- Information about Gaudani Parivar events
- Awards and recognition information
- All UI in Gujarati

**Content:**
- Event details
- Program schedule
- Award categories (First Rank, Second Rank, etc.)
- Contact information
- Event history

### Page 10: View Reports (Admin)
**Route:** `/admin/view-reports`
**Component:** `ViewReports`

**Features:**
- Admin access only
- Comprehensive reporting system
- Separate reports for Gujarati Medium and English Medium
- Filter options:
  - Medium (Gujarati/English/All)
  - Standard/Degree
  - Village
  - Date range
  - Verification status
- Report types:
  - **Summary Report:** Total count, average percentage, top performers
  - **Detailed Report:** All results with full details
  - **Village-wise Report:** Results grouped by village
  - **Standard-wise Report:** Results grouped by standard
  - **Medium-wise Report:** Separate sections for Gujarati and English medium
- Export options:
  - Export to PDF
  - Export to Excel
- Statistics:
  - Total students by medium
  - Average percentage by medium
  - Top 10 students by percentage
  - Distribution by standard
  - Distribution by village
- All UI in Gujarati

**Report Display:**
- Gujarati Medium Section:
  - All results with medium = "gujarati"
  - Statistics and charts
  - Filterable and sortable
- English Medium Section:
  - All results with medium = "english"
  - Statistics and charts
  - Filterable and sortable
- Toggle between sections or view both

## API Endpoints

### Results API
- `POST /api/results` - Create new result
  - Body: FormData (multipart/form-data) or JSON
  - Fields: studentName, standardId, medium, totalMarks (optional), obtainedMarks (optional), percentage (required if marks not provided), villageId, contactNumber (optional), resultImage (optional)
  - Response: Created result object

- `GET /api/results` - Get all results (public and admin)
  - Query params: 
    - page, limit (pagination)
    - medium ("gujarati" | "english")
    - standardId
    - villageId
    - search (student name)
    - sortBy, sortOrder
  - Response: Paginated results

- `GET /api/results/:id` - Get single result
  - Response: Result object

- `PUT /api/results/:id` - Update result (admin only)
  - Body: JSON with fields to update
  - Response: Updated result object

- `DELETE /api/results/:id` - Delete result (admin only)
  - Response: Success message

### Villages API
- `GET /api/villages` - Get all active villages (public)
  - Response: Array of village objects
  - Used for dropdown population

- `GET /api/villages/all` - Get all villages including inactive (admin only)
  - Response: Array of all village objects

- `POST /api/villages` - Create new village (admin only)
  - Body: { villageName: string, isActive: boolean }
  - Response: Created village object

- `PUT /api/villages/:id` - Update village (admin only)
  - Body: { villageName?: string, isActive?: boolean }
  - Response: Updated village object

- `DELETE /api/villages/:id` - Delete village (admin only)
  - Response: Success message

### Standards API
- `GET /api/standards` - Get all active standards (public)
  - Response: Array of standard objects
  - Used for dropdown population

- `GET /api/standards/all` - Get all standards including inactive (admin only)
  - Response: Array of all standard objects

- `POST /api/standards` - Create new standard (admin only)
  - Body: { standardName: string, standardCode: string, displayOrder: number, isCollegeLevel: boolean, isActive: boolean }
  - Response: Created standard object

- `PUT /api/standards/:id` - Update standard (admin only)
  - Body: { standardName?: string, standardCode?: string, displayOrder?: number, isCollegeLevel?: boolean, isActive?: boolean }
  - Response: Updated standard object

- `DELETE /api/standards/:id` - Delete standard (admin only)
  - Response: Success message

### Reports API
- `GET /api/reports/summary` - Get summary statistics (admin only)
  - Query params: medium, standardId, villageId, dateFrom, dateTo
  - Response: Summary statistics object

- `GET /api/reports/by-medium` - Get results grouped by medium (admin only)
  - Query params: standardId, villageId, dateFrom, dateTo
  - Response: { gujarati: [...], english: [...] }

- `GET /api/reports/by-village` - Get results grouped by village (admin only)
  - Query params: medium, standardId, dateFrom, dateTo
  - Response: Array of village-wise results

- `GET /api/reports/by-standard` - Get results grouped by standard (admin only)
  - Query params: medium, villageId, dateFrom, dateTo
  - Response: Array of standard-wise results

- `GET /api/reports/top-performers` - Get top performers (admin only)
  - Query params: medium, limit (default: 10), standardId, villageId
  - Response: Array of top performing students

- `GET /api/reports/export` - Export results to PDF/Excel (admin only)
  - Query params: format ("pdf" | "excel"), medium, standardId, villageId, dateFrom, dateTo
  - Response: File download

- `GET /api/reports/top-three` - Get top 3 students by standard (public/admin)
  - Query params: standardId (optional - if not provided, returns all standards)
  - Response: Array of top 3 results grouped by standard

- `GET /api/reports/top-three-export` - Export top 3 list as DOCX (admin only)
  - Query params: standardId (optional)
  - Response: DOCX file download

- `GET /api/reports/print` - Get print-ready results (public/admin)
  - Query params: medium, standardId, villageId, search
  - Response: Formatted results for printing

- `GET /api/reports/print-college` - Get college results for printing (public/admin)
  - Query params: villageId, search
  - Response: College degree results formatted for printing

- `GET /api/reports/awards/first-rank` - Get first rank students for awards (admin only)
  - Query params: standardId (optional), medium (optional)
  - Response: Array of first rank students grouped by standard

- `GET /api/reports/awards/second-rank` - Get second rank students for awards (admin only)
  - Query params: standardId (optional), medium (optional)
  - Response: Array of second rank students grouped by standard

- `GET /api/reports/awards/export` - Export awards list as DOCX (admin only)
  - Query params: rank ("first" | "second"), standardId (optional), medium (optional)
  - Response: DOCX file download with formatted awards list

### Admin API
- `POST /api/admin/login` - Admin login
  - Body: { email: string, password: string }
  - Response: { token: string, user: { email, username, fullName, role } }
  - Note: Login uses email instead of username
  - Default credentials (if no admin exists):
    - Email: bhavesh@gmail.com
    - Password: Bhavesh@123_

- `GET /api/admin/dashboard` - Get dashboard statistics (admin only)
  - Response: Dashboard statistics object

- `POST /api/admin/create-default` - Create default admin (internal/one-time use)
  - Body: None (uses environment variables or hardcoded defaults)
  - Response: { message: string, admin: object }
  - Note: Only creates admin if no admins exist in database
  - Automatically called on server startup if no admins found

## Component Specifications

### HomePage Component
```typescript
// Features:
- Static content with instructions (using translations)
- Navigation to upload page
- Responsive design
- Multi-language support (Gujarati/English)
- Uses t() function for all text content
```

### UploadResultPage Component
```typescript
// Features:
- Form state management (React Hook Form)
- File upload with preview
- Real-time validation
- API integration
- Error handling
- Success/error notifications
- Loading states
```

### ResultUploadForm Component
```typescript
// Features:
- Form fields rendering
- Validation logic
- Submit handler
- File preview
- Percentage calculation
```

### FileUpload Component
```typescript
// Features:
- File input
- Drag and drop support
- Image preview
- File validation
- Error messages
```

### ViewResultsPage Component
```typescript
// Features:
- Display all results in cards/table
- Filter by medium, standard, village
- Search functionality
- Pagination
- Sort functionality
- Image modal/viewer
- All UI in Gujarati
```

### AdminLoginPage Component
```typescript
// Features:
- Login form with username and password
- Form validation
- Error message display
- Loading state during authentication
- JWT token storage
- Redirect to dashboard on success
- All UI in Gujarati
```

### AdminDashboard Component
```typescript
// Features:
- Statistics cards/widgets
- Charts/graphs for data visualization
- Quick navigation links
- Recent activity feed
- All UI in Gujarati
```

### ManageVillages Component
```typescript
// Features:
- List all villages
- Add new village form
- Edit village modal/form
- Delete confirmation
- Status toggle
- Validation
- All UI in Gujarati
```

### ManageStandards Component
```typescript
// Features:
- List all standards (grouped by school/college)
- Add new standard form
- Edit standard modal/form
- Delete confirmation
- Status toggle
- Display order management
- Validation
- All UI in Gujarati
```

### ViewReports Component
```typescript
// Features:
- Filter panel
- Separate sections for Gujarati and English medium
- Statistics display
- Charts/graphs
- Export functionality
- Print functionality
- All UI in Gujarati
```

### TopThreeRankingPage Component
```typescript
// Features:
- Standard selection dropdown
- Top 3 results grouped by standard
- Display results in tables
- Download as DOCX functionality
- Print functionality
- View all top 3 across standards
- Inline edit/delete (admin only)
- All UI in Gujarati
```

### EventInformationPage Component
```typescript
// Features:
- Display event information
- Program schedule
- Award categories
- Contact information
- Event history
- Multi-language support (Gujarati/English)
- Uses t() function for all text content
```

### LanguageSwitcher Component
```typescript
// Features:
- Dropdown or button group for language selection
- Shows current language
- Updates all UI elements on language change
- Saves preference to localStorage
- Positioned in header/navigation
- Supports Gujarati and English
- Extensible for future languages
```

## Validation Rules

### Frontend Validation
- **Student Name:** Required, 2-100 characters
- **Medium:** Required, must be "gujarati" or "english"
- **Standard:** Required, must be valid standard ID
- **Total Marks:** Optional, number, 1-10000 (required if percentage not provided)
- **Obtained Marks:** Optional, number, 0 to totalMarks (required if percentage not provided)
- **Percentage:** Required if marks not provided, number, 0-100, 2 decimal places
- **Contact Number:** Optional, 10 digits, numeric only
- **Result Image:** Optional, image/PDF, max 5MB
- **Village:** Required, must be valid village ID
- **Validation Logic:** Either (totalMarks AND obtainedMarks) OR percentage must be provided

### Admin Validation
- **Village Name:** Required, 2-100 characters, unique
- **Standard Name:** Required, 2-100 characters
- **Standard Code:** Required, unique, alphanumeric
- **Display Order:** Required, positive number

### Backend Validation
- Same as frontend plus:
- File type validation (MIME type check)
- File size validation
- Sanitize file names
- Validate ObjectId references
- Medium validation: must be "gujarati" or "english"
- Admin authentication for protected routes
- Duplicate village name check
- Duplicate standard code check

## File Upload Handling

### Backend (Multer Configuration)
- **Storage:** Local filesystem (or cloud storage like AWS S3)
- **Destination:** `uploads/results/`
- **File Naming:** `{timestamp}-{originalname}` or UUID
- **File Filter:** Only images (JPG, JPEG, PNG) and PDF
- **Size Limit:** 5MB

### Image Processing (Optional)
- Resize large images
- Generate thumbnails
- Optimize file size

## Authentication & Authorization

### Admin Authentication
- **Method:** Email and password-based authentication with JWT token
- **Login Route:** `/api/admin/login`
- **Login Credentials:** Email and password (not username)
- **Protected Routes:** All `/api/admin/*`, `/api/villages/*` (except GET), `/api/standards/*` (except GET), `/api/reports/*`
- **Middleware:** `authMiddleware.js` - Verify JWT token or session
- **Token Storage:** LocalStorage or sessionStorage (frontend)
- **Session Management:** JWT with expiration or session-based

### Default Admin User Creation
- **Automatic Creation:** On server startup, the system checks if any admin users exist in the database
- **Condition:** If no admin users are found, a default admin user is automatically created
- **Default Admin Credentials:**
  - **Email:** bhavesh@gmail.com
  - **Password:** Bhavesh@123_
  - **Username:** bhavesh (optional field)
  - **Full Name:** Bhavesh (optional field)
  - **Role:** admin
  - **Is Active:** true
- **Implementation:**
  - Create a function `createDefaultAdmin()` in the database initialization script
  - This function should:
    1. Check if any admin exists: `Admin.countDocuments() === 0`
    2. If no admin exists, create default admin with hashed password (bcrypt)
    3. Hash password: `bcrypt.hash('Bhavesh@123_', 10)`
    4. Save to database
    5. Log success message
  - Call this function on server startup (after database connection)
- **Security Note:**
  - Password must be hashed using bcrypt before storage
  - Default password should be changed after first login (recommended)
  - This is a one-time setup for initial deployment

### Public Routes
- All result viewing routes
- Result upload route
- Get active villages and standards

## Error Handling

### Frontend
- Form validation errors
- API error responses
- Network errors
- File upload errors
- User-friendly error messages in Gujarati (where possible)

### Backend
- Validation errors (400)
- File upload errors (400)
- Database errors (500)
- Standardized error response format

## Internationalization (i18n) System

### Language Support
- **Supported Languages:**
  - Gujarati (ગુજરાતી) - Default language (code: `gu`)
  - English - Secondary language (code: `en`)
- **Future Extensibility:** Easy to add more languages by creating new JSON files
- **Language Switcher:** Available in header/navigation on all pages
- **Persistent Preference:** Selected language saved in localStorage

**Note:** This implementation uses a custom i18n solution with React Context API. Alternatively, you can use libraries like `react-i18next` and `i18next` for more advanced features (pluralization, interpolation, etc.). The custom solution is lightweight and sufficient for basic translation needs.

### Language Files Structure

All translations are stored in JSON files located at `src/i18n/languages/`:

```
src/i18n/languages/
├── gu.json          # Gujarati translations
├── en.json          # English translations
└── index.ts         # Language file exports
```

### Translation File Format

Each language file follows a nested object structure organized by feature/page:

**Example: `gu.json` (Gujarati)**
```json
{
  "common": {
    "save": "સાચવો",
    "reset": "રીસેટ",
    "cancel": "રદ કરો",
    "delete": "કાઢી નાખો",
    "edit": "સુધારો કરો",
    "search": "શોધો",
    "submit": "સબમિટ કરો",
    "loading": "લોડ થઈ રહ્યું છે...",
    "error": "ભૂલ",
    "success": "સફળતા"
  },
  "navigation": {
    "home": "ગૌદાની પરિવાર",
    "addResult": "નવું રિજલ્ટ ઉમેરો",
    "addVillage": "ગામ નું નામ ઉમેરો",
    "studentList": "વિધાર્થી નું લીસ્ટ",
    "topThree": "એક થી ત્રણ નંબર નું લીસ્ટ",
    "eventInfo": "કાર્ય ક્રમની માહિતી",
    "logout": "Logout"
  },
  "forms": {
    "studentName": "વિધાર્થી નું પૂરું નામ",
    "standard": "વિધાર્થી નું ધોરણ",
    "medium": "માધ્યમ",
    "gujarati": "ગુજરાતી",
    "english": "ઇંગ્લિશ",
    "totalMarks": "કુલ ગુણ",
    "obtainedMarks": "મેળવેલ ગુણ",
    "percentage": "કુલ આવેલ ટકાવારી",
    "village": "ગામ પરિવાર",
    "contactNumber": "કોન્ટેક નંબર",
    "resultImage": "રિજલ્ટ ની છબી"
  },
  "messages": {
    "success": {
      "resultAdded": "રિજલ્ટ સફળતાપૂર્વક ઉમેરાયું",
      "villageAdded": "ગામ સફળતાપૂર્વક ઉમેરાયું",
      "standardAdded": "ધોરણ સફળતાપૂર્વક ઉમેરાયું"
    },
    "error": {
      "required": "આ ફીલ્ડ આવશ્યક છે",
      "invalidEmail": "અમાન્ય ઇમેઇલ",
      "invalidPhone": "અમાન્ય ફોન નંબર"
    }
  }
}
```

**Example: `en.json` (English)**
```json
{
  "common": {
    "save": "Save",
    "reset": "Reset",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "submit": "Submit",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "navigation": {
    "home": "Gaudani Parivar",
    "addResult": "Add New Result",
    "addVillage": "Add Village Name",
    "studentList": "Student List",
    "topThree": "Top 3 List",
    "eventInfo": "Event Information",
    "logout": "Logout"
  },
  "forms": {
    "studentName": "Student Full Name",
    "standard": "Student Standard",
    "medium": "Medium",
    "gujarati": "Gujarati",
    "english": "English",
    "totalMarks": "Total Marks",
    "obtainedMarks": "Obtained Marks",
    "percentage": "Total Percentage",
    "village": "Village Family",
    "contactNumber": "Contact Number",
    "resultImage": "Result Image"
  },
  "messages": {
    "success": {
      "resultAdded": "Result added successfully",
      "villageAdded": "Village added successfully",
      "standardAdded": "Standard added successfully"
    },
    "error": {
      "required": "This field is required",
      "invalidEmail": "Invalid email",
      "invalidPhone": "Invalid phone number"
    }
  }
}
```

### Language Context Provider

**File: `src/context/LanguageContext.tsx`**

```typescript
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  translations: Record<string, any>;
}
```

**Features:**
- Manages current language state
- Provides translation function `t()`
- Loads language files dynamically
- Persists language preference in localStorage
- Defaults to Gujarati (`gu`)

### Translation Hook

**File: `src/i18n/useTranslation.ts`**

```typescript
// Frontend uses TypeScript
const { t, language, setLanguage } = useTranslation();

// Usage in components:
<h1>{t('navigation.home')}</h1>
<button>{t('common.save')}</button>
```

### Language Switcher Component

**File: `src/components/common/LanguageSwitcher/LanguageSwitcher.tsx`**

**Features:**
- Dropdown or button group to switch languages
- Shows current language flag/name
- Updates all UI elements immediately
- Saves preference to localStorage
- Positioned in header/navigation bar

**Display Options:**
- Dropdown: "ગુજરાતી ▼" / "English ▼"
- Button Group: [ગુજરાતી] [English]
- Icon-based: Flag icons with language code

### Language Configuration

**File: `src/i18n/languageConfig.ts`**

```typescript
// Frontend uses TypeScript
export const supportedLanguages = [
  { code: 'gu', name: 'ગુજરાતી', nativeName: 'ગુજરાતી' },
  { code: 'en', name: 'English', nativeName: 'English' }
];

export const defaultLanguage = 'gu';
```

### Implementation Guidelines

1. **All Text Must Use Translations:**
   - Never hardcode text strings in components
   - Always use `t('key.path')` function
   - Organize keys by feature/page

2. **Adding New Languages:**
   - Create new JSON file: `src/i18n/languages/[code].json`
   - Add language to `languageConfig.ts`
   - Ensure all keys match existing language files
   - Test all pages with new language

3. **Translation Keys Organization:**
   ```
   common.*          - Common UI elements (buttons, labels)
   navigation.*      - Navigation menu items
   forms.*           - Form labels and placeholders
   pages.*            - Page-specific content
   messages.*         - Success/error messages
   validation.*      - Validation error messages
   tables.*           - Table headers and labels
   ```

4. **Dynamic Content:**
   - Student names, village names: Stored in database (Gujarati)
   - UI labels: Translated based on selected language
   - Error messages: Translated
   - Success messages: Translated

### Gujarati Font Support
- Use Gujarati-friendly fonts: Shruti, Noto Sans Gujarati, Mukta, or similar
- Ensure proper rendering of Gujarati characters
- Test on multiple browsers and devices
- Font loading: Load Gujarati fonts when Gujarati is selected

### Data Storage
- **Student names:** Stored in Gujarati (as entered by user)
- **Village names:** Stored in Gujarati (as entered by admin)
- **Standard names:** Stored in Gujarati (as entered by admin)
- **Medium values:** Stored as "gujarati" or "english" (for filtering)
- **UI labels:** Translated based on selected language
- **User preference:** Stored in localStorage as language code

## Styling Guidelines

### Design Principles
- Clean and modern UI
- Mobile-responsive design
- Gujarati font support (Shruti, Noto Sans Gujarati, Mukta)
- Accessible color contrast
- Clear call-to-action buttons
- Intuitive form layout
- Proper Gujarati text alignment and spacing

### Color Scheme
- Primary: Community colors (green/blue theme)
- Success: Green
- Error: Red
- Warning: Orange
- Background: Light gray/white

### Button Color Guidelines
- **Green Buttons:** Save, Submit, Search, Login, Primary actions
- **Red Buttons:** Reset, Cancel, Delete, Destructive actions
- **Orange Buttons:** Print, View All, Secondary actions
- **Blue Buttons:** Download, Export, Tertiary actions
- All button labels in Gujarati where applicable

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_TRANSLITERATION_API_KEY=your_key_here
```

### Backend (.env)
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

# Default Admin User (Optional - can be hardcoded in code)
# These are used only if no admin users exist in database
DEFAULT_ADMIN_EMAIL=bhavesh@gmail.com
DEFAULT_ADMIN_PASSWORD=Bhavesh@123_
DEFAULT_ADMIN_USERNAME=bhavesh
DEFAULT_ADMIN_FULLNAME=Bhavesh
```

**Note:** The default admin user credentials are:
- **Email:** bhavesh@gmail.com
- **Password:** Bhavesh@123_
- These can be hardcoded in the `createDefaultAdmin()` function or read from environment variables
- The default admin is only created if no admin users exist in the database

## Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-hook-form": "^7.48.0",
    "axios": "^1.6.0",
    "zod": "^3.22.0",
    "recharts": "^2.10.0",
    "jspdf": "^2.5.1",
    "xlsx": "^0.18.5",
    "docx": "^8.5.0",
    "file-saver": "^2.0.5"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### Backend (package.json)
```json
{
  "name": "gaudani-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "joi": "^17.11.0",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "pdfkit": "^0.13.0",
    "exceljs": "^4.4.0",
    "docx": "^8.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

## Implementation Steps

### Phase 1: Setup
1. Initialize React + Vite project
2. Initialize Node.js + Express project (JavaScript with ES6 modules)
3. Setup MongoDB connection
4. Create basic folder structure
5. Setup environment variables
6. Setup i18n system:
   - Create language files (gu.json, en.json)
   - Create LanguageContext
   - Create useTranslation hook
   - Create languageConfig
   - Create LanguageSwitcher component

### Phase 2: Database
1. Create Mongoose schemas (Result, Village, Standard, Admin) in JavaScript
2. Create seed data for villages and standards
3. Implement default admin user creation:
   - Check if any admin users exist in database
   - If no admin exists, create default admin:
     - Email: bhavesh@gmail.com
     - Password: Bhavesh@123_ (hash with bcrypt)
     - Username: bhavesh
     - Full Name: Bhavesh
     - Role: admin
     - Is Active: true
   - This should run automatically on server startup in `database.js`
4. Test database connection
5. Test default admin creation

### Phase 3: Backend API
1. Create result routes and controller in JavaScript (with medium field, contact number, percentage input)
2. Create village routes and controller in JavaScript (CRUD operations)
3. Create standard routes and controller in JavaScript (CRUD operations)
4. Create report routes and controller in JavaScript (top 3, print, awards, export)
5. Create admin authentication routes in JavaScript
6. Implement file upload middleware (multer.js)
7. Add validation middleware (Joi validation)
8. Add authentication middleware (JWT verification)
9. Implement DOCX export functionality
10. Implement print functionality
11. Implement top 3 ranking logic
12. Test all endpoints

### Phase 4: Frontend Public Pages
1. Create HomePage component (with translations)
2. Create UploadResultPage component (with medium selection, contact number, percentage input, translations)
3. Create ViewResultsPage component (with filters, print, inline edit/delete, translations)
4. Create TopThreeRankingPage component (with DOCX export, translations)
5. Create EventInformationPage component (with translations)
6. Create form components (all using t() function)
7. Implement file upload component
8. Add Gujarati transliteration
9. Add filtering and search functionality
10. Add print functionality
11. Add inline edit/delete functionality
12. Integrate LanguageSwitcher in header/navigation
13. Ensure all text uses translation keys (no hardcoded strings)

### Phase 5: Frontend Admin Pages
1. Create AdminLoginPage component (with translations)
2. Create AdminDashboard component (with translations)
3. Create ManageVillages component (CRUD, with translations)
4. Create ManageStandards component (CRUD, with translations)
5. Create ViewReports component (with medium separation, translations)
6. Add protected route wrapper
7. Add charts and statistics visualization
8. Implement authentication flow
9. Ensure all admin pages use translation keys

### Phase 6: Integration
1. Connect frontend to backend API
2. Implement form submission (with medium)
3. Implement admin CRUD operations
4. Implement report generation and export
5. Add error handling
6. Add loading states
7. Test complete flow

### Phase 7: Polish
1. Add styling and responsive design (all in Gujarati)
2. Add animations/transitions
3. Optimize performance
4. Add error boundaries
5. Test all features
6. Final testing and bug fixes

## Testing Requirements

### Unit Tests
- Form validation functions
- Utility functions
- API service functions

### Integration Tests
- Form submission flow
- File upload process
- API endpoints

### E2E Tests (Optional)
- Complete user flow from home to result upload

## Security Considerations

1. **File Upload Security**
   - Validate file types (MIME type, not just extension)
   - Limit file size
   - Sanitize file names
   - Store files outside web root
   - Scan for malware (optional)

2. **Input Validation**
   - Validate all inputs on backend
   - Sanitize user inputs
   - Prevent XSS attacks
   - Use parameterized queries (MongoDB handles this)

3. **CORS Configuration**
   - Allow only specific origins
   - Configure proper headers

4. **Rate Limiting** (Future)
   - Limit uploads per IP
   - Prevent abuse

## Performance Optimization

1. **Frontend**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Bundle size optimization

2. **Backend**
   - Database indexing
   - Query optimization
   - File compression
   - Caching (future)

## Future Enhancements

1. Result verification system (enhancement to existing isVerified field)
2. Email notifications for result submissions
3. SMS notifications
4. Advanced analytics and insights
5. Mobile app (React Native)
6. Cloud storage integration (AWS S3, Cloudinary)
7. Image OCR for automatic data extraction
8. Bulk result upload
9. Student profile management
10. Result comparison and trends
11. Automated backup system
12. Advanced search with multiple filters
13. Result sharing via social media
14. QR code generation for results
15. Student ranking system

## Deployment Considerations

### Frontend
- Build for production: `npm run build`
- Deploy to: Vercel, Netlify, or similar
- Environment variables configuration

### Backend
- Deploy to: Heroku, AWS, DigitalOcean, or similar
- MongoDB: MongoDB Atlas (cloud) or self-hosted
- File storage: Local or cloud storage (S3, Cloudinary)

## Support and Maintenance

- Error logging and monitoring
- Regular database backups
- Security updates
- Performance monitoring
- User feedback collection

