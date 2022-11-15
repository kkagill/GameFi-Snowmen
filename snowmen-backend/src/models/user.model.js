const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    account: { type: String, unique: true, required: true, lowercase: true },
    nonce: { type: Number, required: true },
    refreshToken: { type: String },
  });

const User = mongoose.model('User', userSchema);

module.exports = User;