const createHttpError = require("http-errors");
const { User, OtpMobile } = require("./user.model");
const { Op } = require("sequelize");
const {
  hashPassword,
  comparePassword,
} = require("../../common/utils/password");
const jwt = require("jsonwebtoken");
const { userMessages } = require("./user.message");
const { globalMessages } = require("../../common/global.message");

async function createUserHandler(req, res, next) {
  const { first_name, last_name, mobile, email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        mobile,
        [Op.or]: {
          email,
        },
      },
    });
    if (user) return res.status(409).json({ msg: userMessages.userExist });
    const hash = await hashPassword(password);
    const newUser = await User.create({
      first_name,
      last_name,
      mobile,
      email,
      password: hash,
    });
    if (!newUser) return res.status(500).json({ msg: userMessages.problem });
    const otpMobile = await sendOtpMobile(newUser?.id);
    if (!otpMobile)
      return res.status(500).json({ msg: userMessages.otpFailed });
    return res.status(201).json({
      message: userMessages.userCreated,
      otpCode: otpMobile,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

async function sendOtpMobile(userId) {
  const code = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  try {
    const [otp, created] = await OtpMobile.findOrCreate({
      where: { user_id: userId },
      defaults: { code },
    });
    if (!created) otp.code = code;
    const date = new Date();
    // 5 min expire in
    date.setTime(date.getTime() + 5 * 60 * 1000);
    otp.expire_in = date.toUTCString();
    await otp.save();
    return code;
  } catch (error) {
    next(error);
  }
}

async function sendOtpMobileHandler(req, res, next) {
  const { mobile } = req.body;
  try {
    const user = await User.findOne({ where: { mobile } });
    if (!user)
      return res
        .status(404)
        .json({ msg: userMessages.notFound, statusCode: 404 });
    if (user.mobile_verified_at)
      return res
        .status(404)
        .json({ msg: globalMessages.notFoundRoute, statusCode: 404 });
    const otp = await OtpMobile.findOne({ where: { user_id: user?.id } });
    if (otp?.expire_in > Date.now())
      return res
        .status(429)
        .json({ msg: userMessages.otpMobileNotExpireIn, statusCode: 429 });
    const code = await sendOtpMobile(user?.id);
    return res.json({ msg: userMessages.sendOtp, code, statusCode: 200 });
  } catch (error) {
    next(error);
  }
}

async function checkOtpMobileHandler(req, res, next) {
  const { mobile, otpCode } = req.body;
  try {
    const user = await User.findOne({ where: { mobile } });
    if (!user)
      return res
        .status(404)
        .json({ msg: userMessages.notFound, statusCode: 404 });
    if (user?.mobile_verified_at)
      return res
        .status(404)
        .json({ msg: globalMessages.notFoundRoute, statusCode: 404 });
    const otp = await OtpMobile.findOne({ where: { user_id: user?.id } });
    if (otp?.code === otpCode) {
      const date = new Date();
      date.setTime(date.getTime());
      user.mobile_verified_at = date.toUTCString();
      await user.save();
      return res.json({ msg: userMessages.successfullyVerifyMobile });
    }
    return res
      .status(400)
      .json({ msg: userMessages.otpMobileNotCorrect, statusCode: 400 });
  } catch (error) {
    next(error);
  }
}

async function loginUserHandler(req, res, next) {
  const { mobile, password } = req.body;
  try {
    const user = await User.findOne({ where: { mobile } });
    if (!user) return res.status(404).json({ msg: userMessages.notFound });
    if (!user?.mobile_verified_at)
      return res.status(401).json({ msg: userMessages.notVerifiedMobile });
    if (comparePassword(password, user?.password)) {
      const { access_token, refresh_token } = await generateJwtToken({
        userId: user?.id,
      });
      return res.json({ msg: userMessages.login, access_token, refresh_token });
    }
    return res.status(401).json({msg:userMessages.passwordOrMobileNotCorrect,statusCode:401})
  } catch (error) {
    next(error);
  }
}

async function generateJwtToken(payload) {
  const access_token = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECURITY_TOKEN,
    { expiresIn: "14d" }
  );
  const refresh_token = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECURITY_TOKEN,
    { expiresIn: "30d" }
  );

  return { access_token, refresh_token };
}

module.exports = {
  createUserHandler,
  sendOtpMobileHandler,
  checkOtpMobileHandler,
  loginUserHandler,
};
