const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize.config");
const { discountTypes } = require("../../common/product.cons");

const Discount = sequelize.define(
  "discount",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount_type: {
      type: DataTypes.ENUM(...Object.values(discountTypes)),
      allowNull: false,
    },
    limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    use: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
module.exports = { Discount };
