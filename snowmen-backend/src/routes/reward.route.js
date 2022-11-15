const express = require('express');
const auth = require('../middlewares/authorization');
const validate = require('../middlewares/validate');
const { rewardController } = require('../controllers');
const { rewardValidation } = require('../validations');

const router = express.Router();

router.route('/score').post(
    auth.isUserAuthenticated,
    validate(rewardValidation.saveScore),
    rewardController.saveScore
);
router.route('/').get(rewardController.getRewards);

module.exports = router;
