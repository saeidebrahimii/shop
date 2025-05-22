const jwt = require("jsonwebtoken");

const { User } = require("../../user/user.model");
async function authGuard(req, res, next) {
  const { api_key = undefined } = req.headers;
  if (!api_key) return res.status(500).json({ msg: "please login" });
  const { userId } = await verifyToken(api_key);
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ msg: "user not found" });
  req.user = {
    id: user?.id,
    first_name: user?.first_name,
    last_name: user?.last_name,
    mobile: user?.mobile,
  };
  next();
}
async function verifyToken(token) {
  try {
    const verifyToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECURITY_TOKEN,
      {}
    );
    if (!verifyToken) return res.status(500).json({ msg: "please login." });
    return verifyToken;
  } catch (error) {
    next(error);
  }
}

module.exports = { authGuard };
