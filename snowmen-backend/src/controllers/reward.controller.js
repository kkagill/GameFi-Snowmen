const httpStatus = require('http-status');
const { rewardService, blockchainService } = require('../services');

const getRewards = async (_, res) => {
  const rewards = await rewardService.getAllRewards();
  res.status(httpStatus.OK).send({ rewards });
};

const saveScore = async (req, res) => {
  const { account, score } = req.body;

  try {
    const result = await rewardService.createReward(account, score);

    if (result) {
      const receipt = await blockchainService.sendSnowmenToken(account, score);

      if (receipt.status === 1) {
        const { _id: rewardId } = result;
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
