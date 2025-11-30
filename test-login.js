const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function testLogin() {
  try {
    const email = 'admin@piyushkatole.com';
    const password = 'admin123456';
    
    console.log('\n🔍 Looking for user with email:', email);
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }
    
    console.log('✅ User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    
    console.log('\n🔐 Testing password match...');
    console.log('Entered password:', password);
    console.log('Hashed password in DB:', user.password);
    
    const isMatch = await user.matchPassword(password);
    
    if (isMatch) {
      console.log('✅ Password matches!');
    } else {
      console.log('❌ Password does NOT match!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setTimeout(testLogin, 1000);
