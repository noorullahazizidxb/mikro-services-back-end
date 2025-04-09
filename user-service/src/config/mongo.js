require('dotenv').config();

const mongoose = require('mongoose');

const connectMongo = async () => {
    const mongoUri = process.env.MONGO_URI;
    console.log('MONGO_URI:', mongoUri); // Debug log to verify the value
    if (!mongoUri) {
        throw new Error('MongoDB URI is not defined');
    }
    await mongoose.connect(mongoUri); // Removed deprecated options
};

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: String,
  email: String
});

module.exports = {
  connectMongo,
  User: mongoose.model('User', userSchema)
};
