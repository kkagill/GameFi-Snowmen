const express = require('express');
const { webhookController } = require('../controllers');

const router = express.Router();

router.route('/event').post(
    webhookController.sendRandomReward
);
router.route('/').get(webhookController.getWebhooks);

module.exports = router;
