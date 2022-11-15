const express = require('express');
const auth = require('../middlewares/authorization');
const validate = require('../middlewares/validate');
const { userController } = require('../controllers');
const { userValidation } = require('../validations');

const router = express.Router();

router.route('/login').post(validate(userValidation.loginUser), userController.login);
router.route('/verify').post(validate(userValidation.verifySignature), userController.verifySignature);
router.route('/logout').post(userController.logout);
router.route('/').get(userController.getUsers);

module.exports = router;
