const Joi = require("joi");

const newEventVAlidation = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
});

module.exports = { newEventVAlidation };
