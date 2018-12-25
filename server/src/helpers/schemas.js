const Joi = require('joi');

module.exports.uploadFolder = {
    name: Joi.string().required(),
}