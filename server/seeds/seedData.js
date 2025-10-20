const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

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
    reorderLevel: 10,
    unitPrice: 150,
    supplier: 'Medical Supplies Co',
    lastRestockDate: new Date()
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Inventory.deleteMany();

    // Insert data
    const createdUsers = await User.create(users);
    await Inventory.create(inventoryItems);

    console.log('Data Imported!'.green.inverse);
    console.log('Users created:'.cyan);
    createdUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.role}): username=${user.username}, password=demo123`.white);
    });

    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Inventory.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
