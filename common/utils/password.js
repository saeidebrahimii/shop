const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 13);
  return hash;
}
async function comparePassword(password, hashPassword) {
  const isValid = await bcrypt.compare(password, hashPassword);
  return isValid;
}

module.exports = { hashPassword,comparePassword };
