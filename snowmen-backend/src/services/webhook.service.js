const { Webhook } = require('../models');

const getAllWebhooks = async () => {
  return Webhook.find({});
}

const getWebhookByTxHash = async (txHash) => {
  return Webhook.findOne({ txHash });
}

const createWebhook = async (streamId, tag, txHash) => {
  const webhook = new Webhook({
    streamId,
    tag,
    txHash,
  });
  return webhook.save({ webhook });
}

module.exports = {
  getAllWebhooks,
  getWebhookByTxHash,
  createWebhook,
};
