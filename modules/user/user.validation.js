const { Joi } = require("express-validation");

const registerValidation = {
  body: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
};
const loginValidation = {
  body: Joi.object({
    mobile: Joi.string().max(11).required(),
    password: Joi.string().min(8).required(),
  }),
};
const checkOtpMobileValidation = {
  body: Joi.object({
    mobile: Joi.string().max(11).required(),
    otpCode: Joi.string().length(5).required(),
  }),
};
const sendOtpMobileValidation = {
  body: Joi.object({
    mobile: Joi.string().max(11).required(),
  }),
};
module.exports = { registerValidation,loginValidation,checkOtpMobileValidation ,sendOtpMobileValidation};
