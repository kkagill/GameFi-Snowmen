const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    account: { type: String, required: true, lowercase: true },
    amount: { type: Number, required: true },
    processed: { type: Boolean },
    txHash: { type: String },
  });

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;