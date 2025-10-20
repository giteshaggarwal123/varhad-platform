# VARHAD PrEPARED Database Management System

A comprehensive MERN stack web application for managing HIV prevention and PrEP (Pre-Exposure Prophylaxis) services.

## Features

### Multi-Role Authentication
- **4 User Types**: Counsellor, Doctor, Admin, Field Staff
- Role-based access control with JWT authentication
- Secure password hashing with bcrypt

### Core Modules
1. **Client Outreach** - Register new clients with auto-generated unique IDs (VH00001-VH99999)
2. **HIV Testing** - Record test results with automatic conditional routing
3. **PrEP Initiation** - Initiate PrEP for HIV-negative clients
4. **Document Management** - Upload and manage client documents
5. **Inventory Management** - Auto-sync with medication dispensing
6. **Follow-ups** - Track appointments with WhatsApp reminders
7. **HR & Attendance** - Staff attendance management
8. **Asset Management** - Equipment and resource tracking
9. **Client Database** - Searchable database with filtering
10. **Reports & Analytics** - Comprehensive data export

### Key Capabilities
- Auto-generated client IDs (supports up to 100,000 clients)
- Automatic inventory updates when medication dispensed
- WhatsApp Business API integration for reminders
- Conditional logic for HIV test result routing
- Role-based permissions
- Data export (CSV/Excel)
- Date validation and chronological checks

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Clone or Download the Project

```bash
cd C:\Users\gites\varhad-platform
```

### 2. Install Backend Dependencies

```bash
npm install
```

This will install all backend dependencies including:
- express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, multer, helmet, morgan, express-rate-limit

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

This will install React and all frontend dependencies.

### 4. Configure Environment Variables

The `.env` file has already been created with default values. You can modify it if needed:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/varhad_prepared
JWT_SECRET=varhad_prepared_secret_key_2025_change_in_production
JWT_EXPIRE=7d
```

**Important**: Change the JWT_SECRET in production!

### 5. Start MongoDB

Make sure MongoDB is running on your system:

**Windows**:
```bash
# MongoDB should be running as a service
# Or start it manually:
mongod
```

**Mac/Linux**:
```bash
sudo service mongod start
# Or
brew services start mongodb-community
```

### 6. Seed the Database with Demo Users

This will create 4 demo users (one for each role) and populate inventory:

```bash
node server/seeds/seedData.js
```

You should see output like:
```
Data Imported!
Users created:
  - Aparna Banerjee (counsellor): username=aparna.b, password=demo123
  - Dr. Rajesh Sharma (doctor): username=dr.sharma, password=demo123
  - System Admin (admin): username=admin, password=demo123
  - Rahul Verma (fieldstaff): username=field.001, password=demo123
```

## Running the Application

### Option 1: Run Both Frontend and Backend Together (Recommended)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### Option 2: Run Frontend and Backend Separately

**Terminal 1 - Backend**:
```bash
npm run server
```

**Terminal 2 - Frontend**:
```bash
npm run client
```

## Accessing the Application

1. Open your browser and go to: **http://localhost:3000**

2. You'll see the login screen with 4 user type cards

3. Click on any user type to auto-populate credentials:

| User Type    | Username    | Password | Role Description  |
|--------------|-------------|----------|-------------------|
| Counsellor   | aparna.b    | demo123  | Field Worker      |
| Doctor       | dr.sharma   | demo123  | Medical Officer   |
| Admin        | admin       | demo123  | System Manager    |
| Field Staff  | field.001   | demo123  | Outreach Worker   |

4. Click **Login** and you'll be redirected to the Dashboard

## Usage Guide

### Registering a New Client

1. Navigate to **Client Outreach**
2. Fill in client details (name, age, gender, typology, contact, etc.)
3. A unique Client ID (e.g., VH00001) will be auto-generated
4. Click **Save & Continue to HIV Testing**

### Recording HIV Test

1. Navigate to **HIV Testing** (or continue from Client Outreach)
2. Select the client from dropdown
3. Enter test date and result
4. **Automatic Routing**:
   - If **Negative** → redirects to PrEP Initiation
   - If **Positive** → show ART linkage alert
   - If **Pending** → saves and returns to dashboard

### Initiating PrEP

1. Navigate to **PrEP Initiation** (or continue from HIV Testing)
2. Select HIV-negative client
3. Enter medication details (medicine name, quantity, batch number)
4. Set follow-up date
5. Click **Save & Initiate PrEP**
6. **Automatic Actions**:
   - Client status updated to "Active on PrEP"
   - Inventory automatically reduced by dispensed quantity
   - Follow-up reminder automatically created

### Managing Inventory

1. Navigate to **Inventory**
2. View all items with current stock levels
3. Low stock items are highlighted in red
4. Inventory auto-updates when medication is dispensed

### Managing Follow-ups

1. Navigate to **Follow-ups**
2. View all pending, scheduled, and overdue follow-ups
3. Filter by date, type, or counsellor
4. Click **Complete** to mark follow-up as done
5. WhatsApp reminders sent automatically (when API configured)

### Viewing Client Database

1. Navigate to **Client Database**
2. Search by Client ID or name
3. View all registered clients with status badges
4. Export data to Excel (future feature)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/register` - Register new user (Admin only)

### Clients
- `GET /api/clients` - Get all clients (with pagination & filters)
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get single client
- `PUT /api/clients/:id` - Update client
- `GET /api/clients/:id/profile` - Get complete client profile
- `GET /api/clients/stats` - Get client statistics

### Outreach
- `GET /api/outreach` - Get all outreach records
- `POST /api/outreach` - Create outreach record
- `GET /api/outreach/client/:clientId` - Get outreach by client

### HIV Tests
- `GET /api/hiv-tests` - Get all HIV tests
- `POST /api/hiv-tests` - Create HIV test record
- `GET /api/hiv-tests/client/:clientId` - Get HIV test by client

### PrEP
- `GET /api/prep` - Get all PrEP records
- `POST /api/prep` - Create PrEP initiation
- `GET /api/prep/client/:clientId` - Get PrEP by client
- `PUT /api/prep/:id/followup` - Add follow-up record

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create inventory item (Admin only)
- `GET /api/inventory/:id` - Get single item
- `PUT /api/inventory/:id` - Update item
- `POST /api/inventory/:id/transaction` - Add transaction
- `GET /api/inventory/alerts/low-stock` - Get low stock alerts

### Follow-ups
- `GET /api/followups` - Get all follow-ups
- `POST /api/followups` - Create follow-up
- `PUT /api/followups/:id` - Update follow-up
- `GET /api/followups/stats` - Get follow-up statistics

## Database Schema

### Collections
- **users** - Staff/counsellor accounts
- **clients** - Patient records
- **outreaches** - Outreach activities
- **hivtests** - HIV test records
- **preps** - PrEP initiation and tracking
- **documents** - File uploads
- **inventories** - Medical supplies
- **followups** - Appointment tracking
- **attendances** - Staff attendance
- **consents** - Digital consents
- **assets** - Asset management
- **artreferrals** - HIV positive referrals

## Project Structure

```
varhad-platform/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # AuthContext for state
│       ├── pages/          # Page components
│       ├── App.js
│       ├── index.js
│       └── index.css
├── server/                 # Express backend
│   ├── config/            # DB configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & error middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── seeds/             # Database seeding
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
├── uploads/               # File uploads directory
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running. Start it with `mongod` or `brew services start mongodb-community`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change the PORT in `.env` file or kill the process using port 5000

### CORS Errors
If you see CORS errors in the browser console, make sure:
1. Backend is running on port 5000
2. Frontend is running on port 3000
3. CORS is enabled in `server/server.js`

### React Proxy Not Working
If API calls fail, ensure `package.json` in the client folder has:
```json
"proxy": "http://localhost:5000"
```

## Future Enhancements

- [ ] WhatsApp Business API integration
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] Data export to Excel/CSV
- [ ] Document viewer and management
- [ ] Asset depreciation calculator
- [ ] Mobile responsive design improvements
- [ ] Advanced search and filters
- [ ] Audit logs
- [ ] Backup and restore functionality

## Security Considerations

- All passwords are hashed using bcryptjs
- JWT tokens for authentication
- Role-based access control (RBAC)
- Input validation on all forms
- SQL injection protection via Mongoose
- XSS protection via helmet
- Rate limiting on API endpoints
- HTTPS recommended for production

## Production Deployment

### Before deploying to production:

1. **Change JWT Secret**:
   ```
   JWT_SECRET=your_super_secure_random_string_here
   ```

2. **Set NODE_ENV to production**:
   ```
   NODE_ENV=production
   ```

3. **Use production MongoDB**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/varhad
   ```

4. **Build React app**:
   ```bash
   npm run build
   ```

5. **Use environment-specific configs**

6. **Enable HTTPS**

7. **Set up proper logging**

8. **Configure WhatsApp API** (if using)

## License

MIT License - Free to use for healthcare and non-profit organizations

## Support

For issues or questions:
- Create an issue in the project repository
- Contact: varhad-support@example.com

## Credits

Built for VARHAD PrEPARED initiative to support HIV prevention and PrEP services.

---

**Note**: This is a demo system with pre-populated credentials. For production use, implement proper user management, remove demo credentials, and follow security best practices.
