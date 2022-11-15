const { Reward } = require('../models');

const getAllRewards = async () => {
  return Reward.find({});
}

const createReward = async (userId, account, score) => {
  const reward = new Reward({
    userId,
    account,
    score,
    processed: false,
    txHash: ''
  });
  return reward.save({ reward });
}

const updateTxHash = async (rewardId, txHash) => {
  const reward = await Reward.findById(rewardId);
  if (reward) {
    reward.processed = true;
    reward.txHash = txHash;
    await reward.save();
  }
}

module.exports = {
  getAllRewards,
  createReward,
  updateTxHash,
};
