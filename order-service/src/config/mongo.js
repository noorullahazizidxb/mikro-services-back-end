require('dotenv').config();
const mongoose = require('mongoose');

const connectMongo = async () => {
  const mongoUri = process.env.MONGO_URI;
  console.log('MONGO_URI:', mongoUri);
  if (!mongoUri) {
    throw new Error('MongoDB URI is not defined');
  }
  await mongoose.connect(mongoUri);
};

module.exports = { connectMongo };
