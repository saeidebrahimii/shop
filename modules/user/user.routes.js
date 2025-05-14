const { Router } = require("express");
const {
  createUserHandler,
  sendOtpMobileHandler,
  checkOtpMobileHandler,
  loginUserHandler,
} = require("./user.service");
const { validate } = require("express-validation");
const {
  registerValidation,
  loginValidation,
  checkOtpMobileValidation,
  sendOtpMobileValidation,
} = require("./user.validation");

const router = Router();

router.post("/", validate(registerValidation, {}, {}), createUserHandler);
router.post(
  "/send-otp-mobile",
  validate(sendOtpMobileValidation, {}, {}),
  sendOtpMobileHandler
);
router.post(
  "/check-otp-mobile",
  validate(checkOtpMobileValidation, {}, {}),
  checkOtpMobileHandler
);
router.post("/login", validate(loginValidation, {}, {}), loginUserHandler);

module.exports = { userRoutes: router };
