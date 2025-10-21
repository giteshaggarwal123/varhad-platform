const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('../models/User');
const Client = require('../models/Client');
const Inventory = require('../models/Inventory');
const Outreach = require('../models/Outreach');
const HIVTest = require('../models/HIVTest');
const PrEP = require('../models/PrEP');
const FollowUp = require('../models/FollowUp');
const ARTReferral = require('../models/ARTReferral');
const Consent = require('../models/Consent');
const Asset = require('../models/Asset');
const Attendance = require('../models/Attendance');
const Document = require('../models/Document');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected'.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

const users = [
  {
    username: 'aparna.b',
    password: 'demo123',
    name: 'Aparna Banerjee',
    role: 'counsellor',
    email: 'aparna@varhad.org',
    phone: '+91-9876543210',
    district: 'Lucknow'
  },
  {
    username: 'dr.sharma',
    password: 'demo123',
    name: 'Dr. Rajesh Sharma',
    role: 'doctor',
    email: 'dr.sharma@varhad.org',
    phone: '+91-9876543211',
    district: 'Lucknow'
  },
  {
    username: 'admin',
    password: 'demo123',
    name: 'System Admin',
    role: 'admin',
    email: 'admin@varhad.org',
    phone: '+91-9876543212'
  },
  {
    username: 'field.001',
    password: 'demo123',
    name: 'Rahul Verma',
    role: 'fieldstaff',
    email: 'rahul@varhad.org',
    phone: '+91-9876543213',
    district: 'Varanasi'
  }
];

const inventoryItems = [
  {
    itemName: 'PrEP Tablets (TDF/FTC)',
    category: 'PrEP Medication',
    quantity: 2450,
    batchNumber: 'BT2025-034',
    expiryDate: new Date('2026-12-31'),
    reorderLevel: 500,
    unitPrice: 150,
    supplier: 'Pharma Corp India',
    lastRestockDate: new Date()
  },
  {
    itemName: 'HIV Test Kits (Rapid)',
    category: 'HIV Test Kits',
    quantity: 385,
    batchNumber: 'HK2025-012',
    expiryDate: new Date('2026-06-30'),
    reorderLevel: 100,
    unitPrice: 75,
    supplier: 'MedTest Supplies',
    lastRestockDate: new Date()
  },
  {
    itemName: 'Condoms',
    category: 'Condoms',
    quantity: 8500,
    batchNumber: 'CD2025-089',
    expiryDate: new Date('2027-03-31'),
    reorderLevel: 1000,
    unitPrice: 2,
    supplier: 'Safe Health Products',
    lastRestockDate: new Date()
  },
  {
    itemName: 'Syringes (Disposable)',
    category: 'Syringes',
    quantity: 45,
    batchNumber: 'SY2025-001',
    expiryDate: new Date('2026-09-30'),
    reorderLevel: 100,
    unitPrice: 5,
    supplier: 'Medical Supplies Co',
    lastRestockDate: new Date()
  },
  {
    itemName: 'Lubricants',
    category: 'Lubricants',
    quantity: 620,
    batchNumber: 'LB2025-045',
    expiryDate: new Date('2026-08-31'),
    reorderLevel: 200,
    unitPrice: 25,
    supplier: 'Safe Health Products',
    lastRestockDate: new Date()
  },
  {
    itemName: 'Gloves (Boxes)',
    category: 'Gloves',
    quantity: 28,
    batchNumber: 'GL2025-010',
    expiryDate: new Date('2027-12-31'),
    reorderLevel: 50,
    unitPrice: 150,
    supplier: 'Medical Supplies Co',
    lastRestockDate: new Date()
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...'.yellow);
    await User.deleteMany();
    await Client.deleteMany();
    await Inventory.deleteMany();
    await Outreach.deleteMany();
    await HIVTest.deleteMany();
    await PrEP.deleteMany();
    await FollowUp.deleteMany();
    await ARTReferral.deleteMany();
    await Consent.deleteMany();
    await Asset.deleteMany();
    await Attendance.deleteMany();
    await Document.deleteMany();

    // Insert Users first
    console.log('Creating users...'.cyan);
    const createdUsers = await User.create(users);
    const counsellor = createdUsers.find(u => u.role === 'counsellor');
    const doctor = createdUsers.find(u => u.role === 'doctor');

    console.log('Users created:'.green);
    createdUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.role}): username=${user.username}, password=demo123`.white);
    });

    // Insert Inventory
    console.log('\nCreating inventory items...'.cyan);
    await Inventory.create(inventoryItems);
    console.log(`${inventoryItems.length} inventory items created`.green);

    // Create Clients with specific IDs for reference
    console.log('\nCreating clients...'.cyan);
    const clientsData = [
      {
        clientID: 'VH00001',
        name: 'Rajesh Kumar',
        gender: 'Male',
        age: 28,
        typology: 'MSM (Men who have Sex with Men)',
        contactNumber: '9876543001',
        email: 'rajesh.k@example.com',
        preferredContactMethod: 'WhatsApp',
        maritalStatus: 'Unmarried',
        district: 'Lucknow',
        hivStatus: 'Negative',
        prepStatus: 'Active',
        counsellor: counsellor._id,
        registrationDate: new Date('2025-01-15')
      },
      {
        clientID: 'VH00002',
        name: 'Priya Sharma',
        gender: 'Female',
        age: 25,
        typology: 'FSW (Female Sex Workers)',
        contactNumber: '9876543002',
        preferredContactMethod: 'Phone Call',
        maritalStatus: 'Unmarried',
        district: 'Lucknow',
        hivStatus: 'Negative',
        prepStatus: 'Active',
        counsellor: counsellor._id,
        registrationDate: new Date('2025-02-10')
      },
      {
        clientID: 'VH00003',
        name: 'Amit Verma',
        gender: 'Male',
        age: 32,
        typology: 'MSM (Men who have Sex with Men)',
        contactNumber: '9876543003',
        preferredContactMethod: 'WhatsApp',
        maritalStatus: 'Married',
        district: 'Varanasi',
        hivStatus: 'Negative',
        prepStatus: 'Active',
        counsellor: counsellor._id,
        registrationDate: new Date('2025-03-05')
      },
      {
        clientID: 'VH00004',
        name: 'Sita Devi',
        gender: 'Transgender',
        age: 27,
        typology: 'Transgender',
        contactNumber: '9876543004',
        preferredContactMethod: 'WhatsApp',
        maritalStatus: 'Unmarried',
        district: 'Kanpur',
        hivStatus: 'Negative',
        prepStatus: 'Inactive',
        counsellor: counsellor._id,
        registrationDate: new Date('2025-04-20')
      },
      {
        clientID: 'VH00005',
        name: 'Rahul Singh',
        gender: 'Male',
        age: 30,
        typology: 'PWID (People Who Inject Drugs)',
        contactNumber: '9876543005',
        preferredContactMethod: 'Phone Call',
        maritalStatus: 'Divorced',
        district: 'Allahabad',
        hivStatus: 'Not Tested',
        prepStatus: 'Inactive',
        counsellor: counsellor._id,
        registrationDate: new Date('2025-05-12')
      },
      {
        clientID: 'VH00006',
        name: 'Neeta Kapoor',
        gender: 'Female',
        age: 29,
        typology: 'FSW (Female Sex Workers)',
        contactNumber: '9876543006',
        preferredContactMethod: 'WhatsApp',
        maritalStatus: 'Married',
        district: 'Lucknow',
        hivStatus: 'Negative',
        prepStatus: 'Active',
        counsellor: counsellor._id,
        registrationDate: new Date('2025-06-08')
      },
      {
        clientID: 'VH00007',
        name: 'Vikram Patel',
        gender: 'Male',
        age: 26,
        typology: 'MSM (Men who have Sex with Men)',
        contactNumber: '9876543007',
        preferredContactMethod: 'SMS',
        maritalStatus: 'Unmarried',
        district: 'Varanasi',
        hivStatus: 'Negative',
        prepStatus: 'Active',
        counsellor: counsellor._id,
        registrationDate: new Date('2025-07-15')
      },
      {
        clientID: 'VH00008',
        name: 'Maya Singh',
        gender: 'Transgender',
        age: 24,
        typology: 'Transgender',
        contactNumber: '9876543008',
        preferredContactMethod: 'WhatsApp',
        maritalStatus: 'Unmarried',
        district: 'Lucknow',
        hivStatus: 'Negative',
        prepStatus: 'Inactive',
        counsellor: counsellor._id,
        registrationDate: new Date('2025-08-22')
      },
      {
        clientID: 'VH00009',
        name: 'Suresh Yadav',
        gender: 'Male',
        age: 35,
        typology: 'Others',
        contactNumber: '9876543009',
        preferredContactMethod: 'Phone Call',
        maritalStatus: 'Married',
        district: 'Kanpur',
        hivStatus: 'Pending',
        prepStatus: 'Inactive',
        counsellor: counsellor._id,
        registrationDate: new Date('2025-09-10')
      },
      {
        clientID: 'VH00010',
        name: 'Anjali Mehta',
        gender: 'Female',
        age: 31,
        typology: 'FSW (Female Sex Workers)',
        contactNumber: '9876543010',
        preferredContactMethod: 'WhatsApp',
        maritalStatus: 'Widowed',
        district: 'Allahabad',
        hivStatus: 'Negative',
        prepStatus: 'Active',
        counsellor: counsellor._id,
        registrationDate: new Date('2025-09-25')
      }
    ];

    const createdClients = await Client.create(clientsData);
    console.log(`${createdClients.length} clients created (VH00001 - VH00010)`.green);

    // Create Outreach records
    console.log('\nCreating outreach records...'.cyan);
    const outreachData = [
      {
        client: createdClients[0]._id,
        counsellor: counsellor._id,
        outreachDate: new Date('2025-01-20'),
        district: 'Lucknow',
        outreachType: 'Physical Outreach',
        referralMethod: 'One to One',
        additionalDetails: 'Initial contact made through peer educator'
      },
      {
        client: createdClients[1]._id,
        counsellor: counsellor._id,
        outreachDate: new Date('2025-02-15'),
        district: 'Lucknow',
        outreachType: 'Virtual Outreach',
        referralMethod: 'WhatsApp',
        additionalDetails: 'Online counseling session conducted'
      },
      {
        client: createdClients[2]._id,
        counsellor: counsellor._id,
        outreachDate: new Date('2025-03-10'),
        district: 'Varanasi',
        outreachType: 'Physical Outreach',
        referralMethod: 'Facebook',
        additionalDetails: 'Met at community center'
      },
      {
        client: createdClients[3]._id,
        counsellor: counsellor._id,
        outreachDate: new Date('2025-04-22'),
        district: 'Kanpur',
        outreachType: 'Virtual Outreach',
        referralMethod: 'Instagram',
        additionalDetails: 'Contacted through social media'
      },
      {
        client: createdClients[4]._id,
        counsellor: counsellor._id,
        outreachDate: new Date('2025-05-15'),
        district: 'Allahabad',
        outreachType: 'Physical Outreach',
        referralMethod: 'Others',
        additionalDetails: 'Community health camp'
      }
    ];
    await Outreach.create(outreachData);
    console.log(`${outreachData.length} outreach records created`.green);

    // Create HIV Test records
    console.log('\nCreating HIV test records...'.cyan);
    const hivTestData = [
      {
        client: createdClients[0]._id,
        counsellor: counsellor._id,
        engagementDate: new Date('2025-01-25'),
        purposeOfEngagement: 'HIV Testing',
        testDate: new Date('2025-01-25'),
        testResult: 'Negative',
        testType: 'Rapid Test',
        testingLocation: 'VARHAD Clinic',
        unprotectedSexualActivity: true,
        numberOfPartners: 2,
        condomUsageFrequency: 'Sometimes'
      },
      {
        client: createdClients[1]._id,
        counsellor: counsellor._id,
        engagementDate: new Date('2025-02-20'),
        purposeOfEngagement: 'HIV Testing',
        testDate: new Date('2025-02-20'),
        testResult: 'Negative',
        testType: 'Rapid Test',
        testingLocation: 'VARHAD Clinic',
        unprotectedSexualActivity: true,
        numberOfPartners: 3,
        condomUsageFrequency: 'Sometimes'
      },
      {
        client: createdClients[2]._id,
        counsellor: counsellor._id,
        engagementDate: new Date('2025-03-15'),
        purposeOfEngagement: 'HIV Testing',
        testDate: new Date('2025-03-15'),
        testResult: 'Negative',
        testType: 'ELISA',
        testingLocation: 'Partner Lab',
        unprotectedSexualActivity: true,
        numberOfPartners: 1,
        condomUsageFrequency: 'Sometimes'
      },
      {
        client: createdClients[5]._id,
        counsellor: counsellor._id,
        engagementDate: new Date('2025-06-10'),
        purposeOfEngagement: 'HIV Testing',
        testDate: new Date('2025-06-10'),
        testResult: 'Negative',
        testType: 'Rapid Test',
        testingLocation: 'VARHAD Clinic',
        unprotectedSexualActivity: true,
        numberOfPartners: 2,
        condomUsageFrequency: 'Sometimes'
      },
      {
        client: createdClients[6]._id,
        counsellor: counsellor._id,
        engagementDate: new Date('2025-07-20'),
        purposeOfEngagement: 'HIV Testing',
        testDate: new Date('2025-07-20'),
        testResult: 'Negative',
        testType: 'Rapid Test',
        testingLocation: 'VARHAD Clinic',
        unprotectedSexualActivity: true,
        numberOfPartners: 1,
        condomUsageFrequency: 'Always'
      }
    ];
    await HIVTest.create(hivTestData);
    console.log(`${hivTestData.length} HIV test records created`.green);

    // Create PrEP Initiation records
    console.log('\nCreating PrEP initiation records...'.cyan);
    const prepData = [
      {
        client: createdClients[0]._id,
        doctor: doctor._id,
        willingToStart: 'Yes',
        consentSigned: true,
        prepInitiationDate: new Date('2025-02-01'),
        medicineName: 'TDF/FTC (Truvada)',
        prescriptionDuration: 30,
        quantityDispensed: 30,
        batchNumber: 'BT2025-034',
        hepatitisBStatus: 'Not Tested',
        nextFollowUpDate: new Date('2025-03-01'),
        adherenceCounsellingProvided: true,
        sideEffectsDiscussed: true
      },
      {
        client: createdClients[1]._id,
        doctor: doctor._id,
        willingToStart: 'Yes',
        consentSigned: true,
        prepInitiationDate: new Date('2025-02-25'),
        medicineName: 'TDF/FTC (Truvada)',
        prescriptionDuration: 30,
        quantityDispensed: 30,
        batchNumber: 'BT2025-034',
        hepatitisBStatus: 'Negative',
        nextFollowUpDate: new Date('2025-03-25'),
        adherenceCounsellingProvided: true,
        sideEffectsDiscussed: true
      },
      {
        client: createdClients[2]._id,
        doctor: doctor._id,
        willingToStart: 'Yes',
        consentSigned: true,
        prepInitiationDate: new Date('2025-03-20'),
        medicineName: 'TDF/FTC (Truvada)',
        prescriptionDuration: 30,
        quantityDispensed: 30,
        batchNumber: 'BT2025-034',
        hepatitisBStatus: 'Not Tested',
        nextFollowUpDate: new Date('2025-04-20'),
        adherenceCounsellingProvided: true,
        sideEffectsDiscussed: true
      },
      {
        client: createdClients[5]._id,
        doctor: doctor._id,
        willingToStart: 'Yes',
        consentSigned: true,
        prepInitiationDate: new Date('2025-06-15'),
        medicineName: 'TDF/FTC (Truvada)',
        prescriptionDuration: 30,
        quantityDispensed: 30,
        batchNumber: 'BT2025-034',
        hepatitisBStatus: 'Negative',
        nextFollowUpDate: new Date('2025-07-15'),
        adherenceCounsellingProvided: true,
        sideEffectsDiscussed: true
      },
      {
        client: createdClients[6]._id,
        doctor: doctor._id,
        willingToStart: 'Yes',
        consentSigned: true,
        prepInitiationDate: new Date('2025-07-25'),
        medicineName: 'TDF/FTC (Truvada)',
        prescriptionDuration: 30,
        quantityDispensed: 30,
        batchNumber: 'BT2025-034',
        hepatitisBStatus: 'Not Tested',
        nextFollowUpDate: new Date('2025-08-25'),
        adherenceCounsellingProvided: true,
        sideEffectsDiscussed: true
      },
      {
        client: createdClients[9]._id,
        doctor: doctor._id,
        willingToStart: 'Yes',
        consentSigned: true,
        prepInitiationDate: new Date('2025-10-01'),
        medicineName: 'TDF/FTC (Truvada)',
        prescriptionDuration: 30,
        quantityDispensed: 30,
        batchNumber: 'BT2025-034',
        hepatitisBStatus: 'Negative',
        nextFollowUpDate: new Date('2025-11-01'),
        adherenceCounsellingProvided: true,
        sideEffectsDiscussed: true
      }
    ];
    await PrEP.create(prepData);
    console.log(`${prepData.length} PrEP initiation records created`.green);

    // Create Follow-up records
    console.log('\nCreating follow-up records...'.cyan);
    const followUpData = [
      {
        client: createdClients[0]._id,
        counsellor: counsellor._id,
        type: 'Adherence Check',
        dueDate: new Date('2025-03-01'),
        status: 'Completed',
        completionDate: new Date('2025-03-01'),
        adherenceRate: 95,
        notes: 'Client adhering well to medication'
      },
      {
        client: createdClients[1]._id,
        counsellor: counsellor._id,
        type: 'PrEP Refill',
        dueDate: new Date('2025-03-25'),
        status: 'Pending',
        whatsappReminderSent: true,
        notes: 'Reminder sent via WhatsApp'
      },
      {
        client: createdClients[2]._id,
        counsellor: counsellor._id,
        type: 'Adherence Check',
        dueDate: new Date('2025-04-20'),
        status: 'Pending',
        notes: 'First follow-up scheduled'
      },
      {
        client: createdClients[0]._id,
        counsellor: counsellor._id,
        type: 'HIV Re-test',
        dueDate: new Date('2025-04-01'),
        status: 'Scheduled',
        notes: '3-month HIV test scheduled'
      },
      {
        client: createdClients[5]._id,
        counsellor: counsellor._id,
        type: 'PrEP Refill',
        dueDate: new Date('2025-07-15'),
        status: 'Pending',
        notes: 'PrEP refill reminder'
      },
      {
        client: createdClients[6]._id,
        counsellor: counsellor._id,
        type: 'Side Effect Review',
        dueDate: new Date('2025-08-25'),
        status: 'Scheduled',
        notes: 'Check for any side effects'
      },
      {
        client: createdClients[9]._id,
        counsellor: counsellor._id,
        type: 'Doctor Consultation',
        dueDate: new Date('2025-11-01'),
        status: 'Pending',
        notes: 'Regular doctor checkup'
      }
    ];
    await FollowUp.create(followUpData);
    console.log(`${followUpData.length} follow-up records created`.green);

    // Create Consent records
    console.log('\nCreating consent records...'.cyan);
    const consentData = [
      {
        client: createdClients[0]._id,
        counsellor: counsellor._id,
        consentType: 'PrEP Initiation Consent',
        signingMethod: 'Digital Signature via Email',
        sentDate: new Date('2025-02-01'),
        signedDate: new Date('2025-02-01'),
        status: 'Signed'
      },
      {
        client: createdClients[1]._id,
        counsellor: counsellor._id,
        consentType: 'PrEP Initiation Consent',
        signingMethod: 'WhatsApp Digital Consent',
        sentDate: new Date('2025-02-25'),
        signedDate: new Date('2025-02-25'),
        status: 'Signed'
      },
      {
        client: createdClients[0]._id,
        counsellor: counsellor._id,
        consentType: 'HIV Testing Consent',
        signingMethod: 'Digital Signature via Email',
        sentDate: new Date('2025-01-25'),
        signedDate: new Date('2025-01-25'),
        status: 'Signed'
      },
      {
        client: createdClients[2]._id,
        counsellor: counsellor._id,
        consentType: 'PrEP Initiation Consent',
        signingMethod: 'Mobile OTP Verification',
        sentDate: new Date('2025-03-20'),
        signedDate: new Date('2025-03-20'),
        status: 'Signed'
      },
      {
        client: createdClients[5]._id,
        counsellor: counsellor._id,
        consentType: 'Counselling & Disclosure Consent',
        signingMethod: 'WhatsApp Digital Consent',
        sentDate: new Date('2025-06-08'),
        signedDate: new Date('2025-06-08'),
        status: 'Signed'
      },
      {
        client: createdClients[3]._id,
        counsellor: counsellor._id,
        consentType: 'Data Privacy Consent',
        signingMethod: 'Digital Signature via Email',
        sentDate: new Date('2025-04-20'),
        status: 'Pending'
      }
    ];
    await Consent.create(consentData);
    console.log(`${consentData.length} consent records created`.green);

    // Create Asset records
    console.log('\nCreating asset records...'.cyan);
    const assetData = [
      {
        assetID: 'AST-2024-001',
        assetName: 'Medical Refrigerator',
        assetType: 'Medical Equipment',
        purchaseDate: new Date('2024-01-15'),
        purchaseCost: 45000,
        location: 'Main Clinic',
        district: 'Lucknow',
        supplier: 'MedEquip India',
        condition: 'Good',
        warrantyExpiry: new Date('2027-01-15')
      },
      {
        assetID: 'AST-2024-002',
        assetName: 'Desktop Computer',
        assetType: 'Computer & IT',
        purchaseDate: new Date('2024-03-20'),
        purchaseCost: 35000,
        location: 'Reception',
        district: 'Lucknow',
        supplier: 'Dell India',
        condition: 'Good',
        warrantyExpiry: new Date('2027-03-20')
      },
      {
        assetID: 'AST-2024-003',
        assetName: 'Examination Table',
        assetType: 'Furniture',
        purchaseDate: new Date('2024-02-10'),
        purchaseCost: 12000,
        location: 'Consultation Room',
        district: 'Lucknow',
        condition: 'New'
      },
      {
        assetID: 'AST-2024-004',
        assetName: 'Motorcycle - Honda Activa',
        assetType: 'Vehicle',
        serialNumber: 'ME4JC513DHC678945',
        purchaseDate: new Date('2024-05-01'),
        purchaseCost: 85000,
        location: 'Field Operations',
        district: 'Varanasi',
        supplier: 'Honda Showroom',
        condition: 'Good',
        warrantyExpiry: new Date('2029-05-01')
      },
      {
        assetID: 'AST-2024-005',
        assetName: 'Laptop - HP ProBook',
        assetType: 'Computer & IT',
        serialNumber: 'HP2024XYZ123',
        purchaseDate: new Date('2024-06-15'),
        purchaseCost: 55000,
        location: 'Counsellor Office',
        district: 'Lucknow',
        supplier: 'HP India',
        condition: 'New',
        warrantyExpiry: new Date('2027-06-15')
      },
      {
        assetID: 'AST-2024-006',
        assetName: 'Office Chairs Set (10)',
        assetType: 'Furniture',
        quantity: 10,
        purchaseDate: new Date('2024-04-10'),
        purchaseCost: 25000,
        location: 'Main Office',
        district: 'Lucknow',
        condition: 'Good'
      }
    ];
    await Asset.create(assetData);
    console.log(`${assetData.length} asset records created`.green);

    // Create Attendance records
    console.log('\nCreating attendance records...'.cyan);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 2);

    const attendanceData = [
      {
        staff: counsellor._id,
        date: today,
        status: 'Present',
        checkInTime: '09:15 AM',
        checkOutTime: '05:30 PM',
        hoursWorked: 8.25,
        notes: 'Regular day'
      },
      {
        staff: doctor._id,
        date: today,
        status: 'Present',
        checkInTime: '09:00 AM',
        checkOutTime: '06:00 PM',
        hoursWorked: 9,
        notes: 'Clinic duty'
      },
      {
        staff: counsellor._id,
        date: yesterday,
        status: 'Present',
        checkInTime: '09:10 AM',
        checkOutTime: '05:25 PM',
        hoursWorked: 8.25,
        notes: 'Regular day'
      },
      {
        staff: doctor._id,
        date: yesterday,
        status: 'Present',
        checkInTime: '08:50 AM',
        checkOutTime: '06:10 PM',
        hoursWorked: 9.33,
        notes: 'Extra consultations'
      },
      {
        staff: counsellor._id,
        date: dayBefore,
        status: 'On Leave',
        leaveType: 'Casual Leave',
        leaveApproved: true,
        notes: 'Personal work'
      },
      {
        staff: doctor._id,
        date: dayBefore,
        status: 'Present',
        checkInTime: '09:05 AM',
        checkOutTime: '05:50 PM',
        hoursWorked: 8.75,
        notes: 'Regular day'
      }
    ];
    await Attendance.create(attendanceData);
    console.log(`${attendanceData.length} attendance records created`.green);

    // Create Document records
    console.log('\nCreating document records...'.cyan);
    const documentData = [
      {
        client: createdClients[0]._id,
        uploadedBy: counsellor._id,
        documentType: 'Prescription',
        fileName: 'PrEP_Prescription_VH00001.pdf',
        filePath: '/uploads/documents/prep_prescription_001.pdf',
        fileSize: 245670,
        mimeType: 'application/pdf',
        description: 'PrEP prescription - TDF/FTC 30 days',
        uploadDate: new Date('2025-02-01')
      },
      {
        client: createdClients[0]._id,
        uploadedBy: counsellor._id,
        documentType: 'Test Result',
        fileName: 'HIV_Test_Result_VH00001.pdf',
        filePath: '/uploads/documents/hiv_test_001.pdf',
        fileSize: 189340,
        mimeType: 'application/pdf',
        description: 'HIV rapid test - Negative',
        uploadDate: new Date('2025-01-25')
      },
      {
        client: createdClients[1]._id,
        uploadedBy: counsellor._id,
        documentType: 'Consent Form',
        fileName: 'PrEP_Consent_VH00002.pdf',
        filePath: '/uploads/documents/consent_002.pdf',
        fileSize: 156780,
        mimeType: 'application/pdf',
        description: 'Signed PrEP initiation consent',
        uploadDate: new Date('2025-02-25')
      },
      {
        client: createdClients[2]._id,
        uploadedBy: doctor._id,
        documentType: 'Prescription',
        fileName: 'PrEP_Prescription_VH00003.pdf',
        filePath: '/uploads/documents/prep_prescription_003.pdf',
        fileSize: 234560,
        mimeType: 'application/pdf',
        description: 'PrEP prescription with baseline test results',
        uploadDate: new Date('2025-03-20')
      },
      {
        client: createdClients[3]._id,
        uploadedBy: counsellor._id,
        documentType: 'Referral',
        fileName: 'Counselling_Referral_VH00004.pdf',
        filePath: '/uploads/documents/referral_004.pdf',
        fileSize: 123450,
        mimeType: 'application/pdf',
        description: 'Referral to psychosocial support services',
        uploadDate: new Date('2025-04-22')
      },
      {
        client: createdClients[5]._id,
        uploadedBy: counsellor._id,
        documentType: 'Payment Receipt',
        fileName: 'Receipt_VH00006.pdf',
        filePath: '/uploads/documents/receipt_006.pdf',
        fileSize: 98760,
        mimeType: 'application/pdf',
        description: 'Consultation fee receipt',
        uploadDate: new Date('2025-06-10')
      },
      {
        client: createdClients[6]._id,
        uploadedBy: doctor._id,
        documentType: 'Test Result',
        fileName: 'HIV_Test_Result_VH00007.pdf',
        filePath: '/uploads/documents/hiv_test_007.pdf',
        fileSize: 178900,
        mimeType: 'application/pdf',
        description: 'HIV ELISA test - Negative',
        uploadDate: new Date('2025-07-20')
      },
      {
        client: createdClients[0]._id,
        uploadedBy: counsellor._id,
        documentType: 'Other',
        fileName: 'Follow_Up_Notes_VH00001.pdf',
        filePath: '/uploads/documents/followup_notes_001.pdf',
        fileSize: 134560,
        mimeType: 'application/pdf',
        description: 'Monthly follow-up counselling notes',
        uploadDate: new Date('2025-03-01')
      }
    ];
    await Document.create(documentData);
    console.log(`${documentData.length} document records created`.green);

    // Create ART Referral records (for hypothetical positive cases)
    console.log('\nCreating ART referral records...'.cyan);
    const artReferralData = [
      {
        client: createdClients[8]._id,
        counsellor: counsellor._id,
        hivTestDate: new Date('2025-09-15'),
        confirmatoryTestDone: true,
        clientInformed: true,
        referredToART: true,
        artCenterName: 'District Hospital ART Center',
        artRegistrationNumber: 'ART-LKO-2025-1234',
        referralDate: new Date('2025-09-16'),
        artDoctor: 'Dr. Ramesh Kumar',
        followUpAppointmentDate: new Date('2025-10-16'),
        postTestCounsellingProvided: 'Yes - Comprehensive',
        psychosocialSupportNeeded: true,
        partnerNotification: 'Assisted partner notification',
        tbScreeningDone: 'Yes - Negative',
        cd4Count: '245 cells/mm³',
        viralLoad: 'Pending',
        additionalNotes: 'Client coping well, family support available'
      },
      {
        client: createdClients[4]._id,
        counsellor: counsellor._id,
        hivTestDate: new Date('2025-05-18'),
        confirmatoryTestDone: true,
        clientInformed: true,
        referredToART: true,
        artCenterName: 'Medical College ART Center',
        artRegistrationNumber: 'ART-ALD-2025-5678',
        referralDate: new Date('2025-05-19'),
        artDoctor: 'Dr. Sunita Verma',
        followUpAppointmentDate: new Date('2025-06-19'),
        postTestCounsellingProvided: 'Yes - Comprehensive',
        psychosocialSupportNeeded: true,
        partnerNotification: 'Client will inform',
        tbScreeningDone: 'Yes - Negative',
        cd4Count: '389 cells/mm³',
        viralLoad: 'Pending',
        additionalNotes: 'Referral to PWID support group arranged'
      }
    ];
    await ARTReferral.create(artReferralData);
    console.log(`${artReferralData.length} ART referral records created`.green);

    console.log('\n========================================'.green.bold);
    console.log('COMPREHENSIVE DATA IMPORT COMPLETE!'.green.inverse.bold);
    console.log('========================================'.green.bold);
    console.log('\nSummary:'.cyan.bold);
    console.log(`✓ ${createdUsers.length} Users`.white);
    console.log(`✓ ${createdClients.length} Clients (VH00001 - VH00010)`.white);
    console.log(`✓ ${inventoryItems.length} Inventory Items`.white);
    console.log(`✓ ${outreachData.length} Outreach Records`.white);
    console.log(`✓ ${hivTestData.length} HIV Test Records`.white);
    console.log(`✓ ${prepData.length} PrEP Initiation Records`.white);
    console.log(`✓ ${followUpData.length} Follow-up Records`.white);
    console.log(`✓ ${consentData.length} Consent Records`.white);
    console.log(`✓ ${assetData.length} Assets`.white);
    console.log(`✓ ${attendanceData.length} Attendance Records`.white);
    console.log(`✓ ${documentData.length} Document Records`.white);
    console.log(`✓ ${artReferralData.length} ART Referral Records`.white);
    console.log('\nLogin credentials:'.yellow.bold);
    console.log('  Username: admin | Password: demo123'.white);
    console.log('  Username: aparna.b | Password: demo123'.white);
    console.log('  Username: dr.sharma | Password: demo123'.white);
    console.log('  Username: field.001 | Password: demo123'.white);

    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

importData();
