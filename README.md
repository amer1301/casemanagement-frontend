# Case Management Frontend
A React + TypeScript frontend application for managing cases, users, and notifications. This app connects to a backend API and provides a UI for case handling, authentication, and admin functionality.

## 📦 Tech Stack
- React
- TypeScript
- Vite
- React Router
- React Query
- CSS Modules
- Context API (authentication state)

---

## 🚀 Features

### Authentication
- Login & registration
- Auth state handled via context (authContext)
- Protected routes (ProtectedRoute)
  
### Case Management
- View all cases
- View case details
- Create new cases
- View "My Cases"
  
### Notes & Logs
- Case logs and notes displayed in case details
- Translations for statuses, categories, and logs
  
### Notifications
- User notifications page

### Admin Features
- Admin dashboard
- Admin role requests handling

## 🧱 Project Structure
```
src/
│
├── api/            # API calls (cases, stats)
├── assets/         # Static assets (icons)
├── components/
│   ├── Header/
│   ├── layout/
│   └── ProtectedRoute.tsx
│
├── context/        # Auth context
├── lib/            # React Query setup
├── pages/          # App pages
│   ├── Dashboard/
│   ├── CaseList/
│   ├── CaseDetail/
│   ├── CreateCase/
│   ├── MyCases/
│   ├── Notifications/
│   ├── Login/
│   ├── Register/
│   └── AdminRequest/
│
├── types/          # TypeScript types
├── utils/          # Translations & helpers
│
├── App.tsx
└── main.tsx
```

---
## ⚙️ Setup & Run
1. Install dependencies
```bash
npm install
```
2. Start development server
```bash
npm run dev
```
App will run at:
```bash
http://localhost:5173
```
## 🔧 Environment Variables
Environment variables are defined in:
```
.env
```
Typical usage (based on API structure):
```
VITE_API_BASE_URL=http://localhost:8080
```

## 🔌 API Integration
API calls are handled in:
```
src/api/
```
Includes:
- caseApi.ts
-statsApi.ts

Uses React Query for:
- Data fetching
- Caching
- Server state management

### 🔐 Routing & Protection
- Routing handled via React Router
- Protected routes implemented with:
```
ProtectedRoute.tsx
```
- Layout wrapper:
```
components/layout/Layout.tsx
```

## 🎨 Styling
- CSS Modules used for scoped styles
- Each page/component has its own .module.css

Example:
```
Dashboard.module.css
CaseList.module.css
```
## 🌍 Translations / Mapping
Utility mappings for backend values:
```
src/utils/
```
includes: 
- statusTranslations.ts
- categoryTranslations.ts
- logTranslations.ts

## 🧠 State Management
Global auth state via Context API:
- authContext.tsx
Server state via React Query:
- lib/reactQuery.ts

## 📄 Pages Overview
- / → Dashboard
- /cases → Case list
- /cases/:id → Case detail
- /create → Create case
- /my-cases → User-specific cases
- /notifications → Notifications
- /login → Login
- /register → Register
- /admin/requests → Admin role requests

## 📦 Build
```bash
npm run build
```
