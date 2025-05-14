const { OtpEmail, User, OtpMobile } = require("../modules/user/user.model");
const { sequelize } = require("./sequelize.config");

OtpEmail.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});
OtpMobile.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});

// sequelize.sync({ force: true });
