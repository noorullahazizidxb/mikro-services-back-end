const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  email: String
});

// Use existing model if it exists, otherwise define it
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
