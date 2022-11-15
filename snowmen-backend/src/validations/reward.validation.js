const Joi = require('@hapi/joi');

const saveScore = {
  body: Joi.object().keys({
    account: Joi.string().required(),
    score: Joi.number().required(),
  }),
};

module.exports = {
  saveScore,
};
