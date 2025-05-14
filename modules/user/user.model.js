const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize.config");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    mobile_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull:true
    },
    user_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull:true
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
const OtpMobile = sequelize.define(
  "otp_mobile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expire_in: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
const OtpEmail = sequelize.define(
  "otp_email",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expire_in: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = { User, OtpMobile, OtpEmail };
