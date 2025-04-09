require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/order.model');

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  console.log('MONGO_URI:', mongoUri); // Debug log to verify the value
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in the environment variables.');
  }

  await mongoose.connect(mongoUri);
  await Order.deleteMany();

  await Order.create([
    { orderId: 'o1', userId: 'u1', product: 'Laptop', quantity: 1, price: 1000 },
    { orderId: 'o2', userId: 'u1', product: 'Mouse', quantity: 2, price: 50 },
    { orderId: 'o3', userId: 'u2', product: 'Keyboard', quantity: 1, price: 100 }
  ]);

  console.log('Seeded mock orders.');
  process.exit();
}

seed();
