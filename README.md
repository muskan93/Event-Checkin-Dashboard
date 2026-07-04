# Event Customer Check-In Dashboard

A ReactJS web application for managing event customer check-ins, QR code verification, booth assignment, and customer status updates.

## Project Overview

This dashboard provides a complete event management workflow:

- **Login** — Secure authentication with JWT token storage
- **Dashboard** — Summary cards and status distribution chart
- **Customer Management** — Full CRUD with search, filter, and detail modal
- **QR Scanner** — Camera-based QR scanning and manual entry for check-in
- **Booth Assignment** — Assign checked-in customers to booths with conflict prevention
- **Status Update** — Update customer event status with history tracking

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| State Management | Zustand |
| HTTP Client | Axios |
| Form Validation | React Hook Form |
| QR Scanner | html5-qrcode |
| Charts | Recharts |
| Notifications | React Toastify |
| API Server | Express.js (mock backend) |

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd event-checkin-dashboard

# Install frontend dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..
```

### Running Locally

```bash
# Start both API server (port 3001) and frontend (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Login Credentials

| Field | Value |
|-------|-------|
| Email | `admin@event.com` |
| Password | `admin123` |

## API Details

Base URL: `http://localhost:3001/api`

All endpoints except `/login` require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Authenticate user |
| GET | `/dashboard-summary` | Dashboard stats and chart data |
| GET | `/customers` | List all customers |
| POST | `/customers` | Create customer |
| GET | `/customers/:id` | Get customer by ID |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |
| GET | `/qr-codes/verify/:qrCode` | Verify QR code |
| POST | `/customers/check-in` | Check in customer |
| GET | `/booth-assignments` | List assignments and booths |
| POST | `/booth-assignments` | Create assignment |
| PUT | `/booth-assignments/:id` | Update assignment |
| DELETE | `/booth-assignments/:id` | Cancel assignment |
| POST | `/customer-status` | Update customer status |
| GET | `/customer-status/:customerId` | Get status history |

### Sample QR Codes

| QR Code | Status |
|---------|--------|
| `QR-EVT-001` | Unused (available for check-in) |
| `QR-EVT-002` | Already used |
| `QR-EVT-004` | Unused |

## Third-Party Libraries

1. **html5-qrcode** — QR code camera scanning
2. **recharts** — Dashboard status distribution bar chart
3. **react-toastify** — Toast notifications for success/error feedback
4. **react-hook-form** — Form validation
5. **zustand** — Auth state management
6. **axios** — HTTP client with interceptors
7. **react-router-dom** — Client-side routing and protected routes

## Folder Structure

```
src/
├── api/                  # Axios instance and API service layer
├── components/           # Reusable UI components
├── features/
│   ├── auth/             # Login page
│   ├── dashboard/        # Dashboard with charts
│   ├── customers/        # Customer CRUD
│   ├── qrScanner/        # QR scan and check-in
│   ├── boothAssignment/  # Booth management
│   └── customerStatus/   # Status update and history
├── routes/               # Protected and public route guards
├── store/                # Zustand auth store
├── utils/                # Constants and helpers
├── App.jsx
└── main.jsx
server/                   # Express mock API
```

## Deployment

### Frontend (Vercel / Netlify)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variable for API URL if deploying backend separately

### Backend

Deploy the `server/` folder to Railway, Render, or any Node.js host. Update the Vite proxy or set `VITE_API_URL` for production.

## Screenshots

> Add screenshots of Login, Dashboard, Customers, QR Scanner, Booth Assignment, and Status Update pages after running the app.

## License

MIT
