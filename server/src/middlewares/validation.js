const Joi = require('joi');


module.exports.bodyValidation = async (schema, req, res, next) => {
  const jSchema = Joi.object().keys(schema)
  console.log(req.body)
  const {
    error, value
  } = Joi.validate(
    req.body,
    jSchema
  );
  if (error) {
    req.logger.info(error.details[0])
    return next({ message: error.details[0].message, status: 403 });
  }
  req.value = value;
  return next();
};
