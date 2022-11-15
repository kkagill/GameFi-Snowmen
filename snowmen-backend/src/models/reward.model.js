const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    account: { type: String, required: true, lowercase: true },
    score: { type: Number, required: true },
    processed: { type: Boolean },
    txHash: { type: String },
  });

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;