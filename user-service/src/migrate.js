require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  console.log('MONGO_URI:', mongoUri); // Debug log to verify the value
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in the environment variables.');
  }

  await mongoose.connect(mongoUri);
  await User.deleteMany();

  await User.create([
    { userId: 'u1', name: 'Alice', email: 'alice@example.com' },
    { userId: 'u2', name: 'Bob', email: 'bob@example.com' }
  ]);

  console.log('Seeded mock users.');
  process.exit();
}

seed();
