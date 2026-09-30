const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mdmominulislam310_db_user:AyAkXX6zXNysxqYy@cluster0.n9zqo1n.mongodb.net/ecom?retryWrites=true&w=majority';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const email = 'admin@gmail.com';
    const rawPassword = 'admin123456';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.password = hashedPassword;
      existingUser.role = 'admin';
      await existingUser.save();
      console.log(`Admin user (${email}) updated successfully.`);
    } else {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: email,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`Admin user (${email}) created successfully.`);
    }

    console.log(`
----------------------------------
Admin Credentials Created:
Email: ${email}
Password: ${rawPassword}
Role: admin
----------------------------------
    `);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
