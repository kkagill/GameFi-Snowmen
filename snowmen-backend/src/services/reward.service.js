const { Reward } = require('../models');

const getAllRewards = async () => {
  return Reward.find({});
}

const createReward = async (account, amount) => {
  const reward = new Reward({
    account,
    amount,
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
