const httpStatus = require('http-status');
const { rewardService, blockchainService } = require('../services');

const getRewards = async (_, res) => {
  const rewards = await rewardService.getAllRewards();
  res.status(httpStatus.OK).send({ rewards });
};

const saveScore = async (req, res) => {
  const { user } = req;
  const { account, score } = req.body;

  try {
    const reward = await rewardService.createReward(user._id, account, score);

    if (reward) {
      const receipt = await blockchainService.sendSnowmenToken(account, score);

      if (receipt.status === 1) {
        const { _id: rewardId } = reward;
        await rewardService.updateTxHash(rewardId, receipt.transactionHash);
        console.log(receipt.transactionHash)
        return res.status(httpStatus.OK).send();
      }

      return res.status(httpStatus.NOT_FOUND).send({ error: 'No receipt found' });
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message });
  }
};

module.exports = {
  getRewards,
  saveScore,
};
