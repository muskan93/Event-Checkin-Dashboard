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
git clone https://github.com/muskan93/Event-Checkin-Dashboard.git
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


## Screenshots

1. Login Page
<img width="1920" height="1080" alt="Login Page" src="https://github.com/user-attachments/assets/eda09b42-6f58-4544-b6fd-51ad16e3607e" />


2. Dashboard Page
<img width="1919" height="1006" alt="Dashboard Page" src="https://github.com/user-attachments/assets/8d334ec5-6270-49cf-ba88-220682bf3dce" />


3. Customer Management Page
<img width="1914" height="1012" alt="Customer Management" src="https://github.com/user-attachments/assets/ea0c2256-e937-4ab2-9c4f-72c7ba9b605b" />


4. QR Code Scanner Page
<img width="1914" height="1000" alt="QR Scanner Page" src="https://github.com/user-attachments/assets/374509ba-cab0-47de-92ab-2f2fabcf3c41" />


5. Booth Assignment Page
<img width="1919" height="1005" alt="Booth Assignment Page" src="https://github.com/user-attachments/assets/d6813769-26d3-46cd-833b-a51547359f32" />


6. Customer Status Update Page
<img width="1918" height="1006" alt="Status Update Page" src="https://github.com/user-attachments/assets/550fc704-afa7-430b-b614-0e49e1bc9a00" />



## License

MIT
