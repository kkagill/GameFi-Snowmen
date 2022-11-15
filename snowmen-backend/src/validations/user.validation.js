const Joi = require('@hapi/joi');

const loginUser = {
  body: Joi.object().keys({
    account: Joi.string().required(),
  }),
};

const verifySignature = {
  body: Joi.object().keys({
    account: Joi.string().required(),
    signature: Joi.string().required(),
  }),
};

module.exports = {
  loginUser,
  verifySignature,
};
