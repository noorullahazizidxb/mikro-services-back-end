require('dotenv').config();
const mongoose = require('mongoose');
const startGrpcServer = require('./grpc/server');

const connectMongo = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in the environment variables.');
  }
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
};

(async () => {
  try {
    await connectMongo();
    startGrpcServer(process.env.PORT || 50052);
  } catch (error) {
    console.error('Failed to start order-service:', error.message);
    process.exit(1);
  }
})();
