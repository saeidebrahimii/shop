const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize.config");
const { orderTypes, discountTypes } = require("../../common/product.cons");

const Order = sequelize.define(
  "order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(orderTypes)),
      allowNull: true,
      defaultValue: orderTypes.pending,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    finalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    address:{
      type:DataTypes.TEXT,
      allowNull:true
    }
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
const OrderItem = sequelize.define(
  "order_item",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    size_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
module.exports = { Order, OrderItem };
