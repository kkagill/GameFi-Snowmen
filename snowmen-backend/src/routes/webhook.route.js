const express = require('express');
const auth = require('../middlewares/authorization');
const validate = require('../middlewares/validate');
const { webhookController } = require('../controllers');
//const { webhookValidation } = require('../validations');

const router = express.Router();

router.route('/event').post(
    //validate(webhookValidation.saveScore),
    webhookController.sendRandomReward
);

module.exports = router;
