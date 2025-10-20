# Quick Setup Guide for VARHAD PrEPARED

Follow these steps to get the application running on your local machine.

## Prerequisites Checklist

- [ ] Node.js (v14+) installed
- [ ] MongoDB (v4.4+) installed
- [ ] Terminal/Command Prompt access

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Navigate to project directory
cd C:\Users\gites\varhad-platform

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Start MongoDB

**Make sure MongoDB is running!**

Windows:
```bash
# Check if MongoDB service is running
# Or start manually in a new terminal:
mongod
```

### 3. Seed Demo Data

```bash
# This creates 4 demo users and inventory items
node server/seeds/seedData.js
```

You should see:
```
Data Imported!
Users created:
  - Aparna Banerjee (counsellor): username=aparna.b, password=demo123
  - Dr. Rajesh Sharma (doctor): username=dr.sharma, password=demo123
  - System Admin (admin): username=admin, password=demo123
  - Rahul Verma (fieldstaff): username=field.001, password=demo123
```

### 4. Start the Application

```bash
# Run both frontend and backend together
npm run dev
```

Wait for:
```
Server running in development mode on port 5000
Compiled successfully!
```

### 5. Open in Browser

Go to: **http://localhost:3000**

### 6. Login

Click on any user type card (e.g., "Counsellor") and click Login.

Credentials are auto-filled!

## Demo User Credentials

| Role        | Username  | Password |
|-------------|-----------|----------|
| Counsellor  | aparna.b  | demo123  |
| Doctor      | dr.sharma | demo123  |
| Admin       | admin     | demo123  |
| Field Staff | field.001 | demo123  |

## Quick Test Workflow

1. **Login** as Counsellor (aparna.b)
2. Go to **Client Outreach**
3. Fill in a new client:
   - Name: "Test Client"
   - Age: 25
   - Gender: Male
   - District: "Test District"
   - Contact Number: "1234567890"
4. Click **Save & Continue to HIV Testing**
5. Select the newly created client
6. Choose Test Result: **Negative**
7. Click **Save & Continue**
8. You'll be redirected to **PrEP Initiation**
9. Fill in medication details:
   - Medicine: TDF/FTC (Truvada)
   - Quantity: 30
   - Next Follow-up Date: (30 days from today)
10. Click **Save & Initiate PrEP**
11. Check **Inventory** - quantity should be reduced
12. Check **Follow-ups** - new follow-up should appear

## Common Issues

### Issue: MongoDB not connected
**Solution**:
```bash
# Start MongoDB
mongod
```

### Issue: Port 5000 already in use
**Solution**:
```bash
# Edit .env file and change PORT=5000 to PORT=5001
```

### Issue: Cannot find module
**Solution**:
```bash
# Reinstall dependencies
npm install
cd client && npm install
```

## Next Steps

- Explore the Dashboard
- Try creating clients with different HIV test results
- Check inventory auto-updates
- View the client database
- Test follow-up management

## Need Help?

Check the main README.md for detailed documentation.

---

**Happy Testing!** 🎉
