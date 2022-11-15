const httpStatus = require('http-status');
const { rewardService, blockchainService } = require('../services');

const sendRandomReward = async (req, res) => {
  const body = req.body;
  console.log(body)
  return res.status(httpStatus.OK).send({body});
};

module.exports = {
  sendRandomReward,
};
