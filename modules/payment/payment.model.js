const { DataTypes, ENUM } = require("sequelize");
const { sequelize } = require("../../config/sequelize.config");
const { discountTypes, paymentTypes } = require("../../common/product.cons");

const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    authority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    finalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    gateway: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ref_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    card_pan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fee_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fee: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: ENUM(Object.values(paymentTypes)),
      allowNull: true,
      defaultValue: paymentTypes.pending,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
module.exports = { Payment };
