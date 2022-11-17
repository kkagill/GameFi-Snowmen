const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema(
  {
    streamId: { type: String, required: true },
    tag: { type: String, required: true },
    txHash: { type: String, required: true }
  });

const Webhook = mongoose.model('Webhook', webhookSchema);

module.exports = Webhook;